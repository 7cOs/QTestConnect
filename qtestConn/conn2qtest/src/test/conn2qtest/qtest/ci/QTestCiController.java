package test.conn2qtest.qtest.ci;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import test.conn2qtest.QTestConnect;
import test.conn2qtest.utils.QTestCiUtils;

public class QTestCiController {
  
  public static final String BASE_URL = QTestCiUtils.getString(QTestCiCfgData.get("baseURL"));
  public static final String TEST_DESIGN_URL = QTestCiUtils.getString(QTestCiCfgData.get("compassPortalTestDesignURL"));
  public static final String TEST_CASE_URL = QTestCiUtils.getString(QTestCiCfgData.get("compassPortalTestCaseURL"));
  public static final boolean MODE = QTestCiUtils.getBoolean(QTestCiCfgData.get("isSilentMode"));
  public static final int WAIT = QTestCiUtils.getInt(QTestCiCfgData.get("wait"));
  
  public static WebDriver d, controller;
  public static JavascriptExecutor jse = null;
  
  public static boolean ciControllerStarted = false;
  public static boolean sessionsTerminated = false;
  
  public static WebDriver launchLoginQTest(String url, boolean mode) 
		  throws InterruptedException {
	launch(url, mode);
	login();
	// - Terminate existing sessions
	terminateSessions(url, mode);
	pause(1525);
	
    // - Preface browser title - //
    String bt = (String)jse.executeScript("return document.title");
    jse.executeScript("document.title='QTestCiController - " + bt+"';");
    return d;
  }
  
  public static void launch(String url, boolean mode) {
	// - Get driver properties - //
	JsonObject dps = QTestCiUtils.getJso(QTestCiCfgData.get("driverProps"));
    System.setProperty(dps.get("name").getAsString(), dps.get("path").getAsString());
    
    ChromeOptions os = new ChromeOptions();
    os.addArguments("--start-maximized");
    os.setHeadless( mode );
    
    d = new ChromeDriver( os ); 
    jse = (JavascriptExecutor) d;
    d.navigate().to(url);
    d.manage().window().maximize();
	    
    waitUntilPageLoadComplete();
  }
  
  public static void login() {
	enterCredentials();
  }

  public static void enterCredentials() {
	JsonObject cs = QTestCiUtils.getJso(QTestCiCfgData.get("credentials"));
	cs.keySet().forEach(k -> {
		jse.executeScript("arguments[0].value='"+cs.get(k).getAsString()+"';", 
				  waitUntilElementAvailable(QTestCiComponent.getXpath(k), 5));
	});
	
	click("Log In");
	waitUntilPageLoadComplete();
  }
  
  public static void terminateSessions(String url, boolean mode) {
	  String xpath = "//*[@id='activeSessionTable']//a[@title='Remove']//span";
	  try {
		  List<WebElement> icos = waitUntilElementsAvailable(xpath, 1);
		  for( int i=0; i<icos.size(); i++ ) {
			  icos.get(i).click();
			  sessionsTerminated = true;
			  pause(325); // - make it soak... - //
			  terminateSessions(url, mode);
		  }
	  } catch( Exception x ) {
		  // x.printStackTrace();
		  if( sessionsTerminated ) {
			  System.out.println("Terminated sessions detected "
			  		+ "- intiating re-login process...");
			  reLogin();
			  return;
		  }
	  }
  }
  
  public static void reLogin() {
	  try {
		  click("Go");
		  System.out.println("Re-login process initiated!!");
	  } catch ( Exception x ) {}
  }

  public static void pause(int t) throws InterruptedException {
	  Thread.sleep(t);
  }
  
  public static void waitUntilPageLoadComplete() {
    new WebDriverWait(d, WAIT).until(
        webDriver -> ((JavascriptExecutor) webDriver)
        .executeScript("return document.readyState").equals("complete"));    
  }

  public static WebElement waitUntilElementAvailable(String xpath) {
	  try {
		    return new WebDriverWait(d, WAIT).until(ExpectedConditions
		        .visibilityOfElementLocated(By.xpath(xpath)));
	  } catch( Exception x ) {}
	  
	  return null;
  }

  public static WebElement waitUntilElementAvailable(String xp, int w) {
	  try {
	    return new WebDriverWait(d, w).until(ExpectedConditions
	        .visibilityOfElementLocated(By.xpath(xp)));
	  } catch( Exception x ) {}
	  
	  return null;
  } 
  
  public static List<WebElement> waitUntilElementsAvailable(String xpath) {
	  try {
		    return new WebDriverWait(d, WAIT).until(ExpectedConditions
		        .visibilityOfAllElementsLocatedBy(By.xpath(xpath)));
	  } catch( Exception x ) {}
	  
	  return null;
  }
  
  public static List<WebElement> waitUntilElementsAvailable(String xp, int w) {
	  try {
		    return new WebDriverWait(d, w).until(ExpectedConditions
		            .visibilityOfAllElementsLocatedBy(By.xpath(xp)));
	  } catch( Exception x ) {}
	  
	  return null;
  } 
  
  public static void enter(String data) {
	  // - get component xpath - //
  }
  
  public static void click(String name) {
	  jse.executeScript("arguments[0].click();", 
			  waitUntilElementAvailable(QTestCiComponent.getXpath(name), 5) );
  }
  
  public static void clickNavItem(String name) {
	  String xp = QTestCiComponent.getXpath("navTreeNode") .replace("[Name]", name);
	  jse.executeScript("arguments[0].click();", waitUntilElementAvailable(xp, 5) );
  }
   
  public static boolean logout() {
    jse.executeScript("document.querySelector('#log-out-link').click();");
    waitUntilPageLoadComplete();
    return d.getTitle().contains( "Login" );
  }
  
  public static void quit() {
    logout(); // - cI logout - //
    d.close();  d.quit(); // - Drop - //
    System.out.println("WebDriver closed and exited successfully!");
  }
  
  public static boolean insertStepDescExpectedResultsSteps()
      throws InterruptedException, IOException {

    try {
      List<ArrayList<String>> stepsContainer = parseSteps();

      for (int n = 0; n < stepsContainer.size(); n++) {
        ArrayList<String> steps = stepsContainer.get(n);
        for (int i = 0; i < steps.size(); i++) {
  
          WebElement gridrow = d.findElements(By.className("gridxRowTable")).get(i);
  
          if (n == 0) {
            WebElement stepdesc = gridrow.findElements(By.tagName("td")).get(2);
            stepdesc.click();
            Thread.sleep(55);
            gridrow = d.findElements(By.className("gridxRowTable")).get(i);
            stepdesc = gridrow.findElements(By.tagName("td")).get(2);
            d.switchTo().frame(stepdesc.findElement(By.tagName("iframe"))).findElement(By.id("tinymce"))
                .sendKeys(steps.get(i));
  
            // d.switchTo().defaultContent();
          } else if (n == 1) {
            WebElement expectedres = gridrow.findElements(By.tagName("td")).get(3);
            expectedres.click();
            Thread.sleep(55);
            gridrow = d.findElements(By.className("gridxRowTable")).get(i);
            expectedres = gridrow.findElements(By.tagName("td")).get(3);
            d.switchTo().frame(expectedres.findElement(By.tagName("iframe"))).findElement(By.id("tinymce"))
                .sendKeys(steps.get(i));
  
            // d.switchTo().defaultContent();
          }
  
          d.switchTo().defaultContent();
          d.findElement(By.id("testcaseContentPane")).click();
        }
      }
      
      // - Persist TestCase - //
      // d.findElement(By.id("testdesignToolbarSave")).click();
      return true;
    }
    finally {
      // quit();
    } 
  }

  public static void extractStepsDescExpectedResultRawData() throws IOException {
	String gcdr = QTestCiComponent.getXpath("gridColDataRaw");
	String[] cols = { "Step description", "Expected result" };
	// - Grab - //
	for( String c : cols ) {
		long ix = (long)jse.executeScript("return arguments[0].cellIndex", 
				waitUntilElementAvailable(QTestCiComponent.getXpath( c ), 5));
		String xp = gcdr.replace("INDEX", String.valueOf(ix+1));
		String dat = (String)jse.executeScript("return arguments[0].innerHTML", 
				waitUntilElementAvailable(xp, 5));
		// - Parse - //
		dat = dat.replaceAll("<br>", "\n").replaceAll("<p>", "").replaceAll("</p>", "");
		// - Persist - //
		String fn = c== "Step description" ? "./app/steps_desc.txt" : "./app/expected_res.txt";
		Files.write(Paths.get(fn), dat.getBytes());
	}
  }

  public static List<ArrayList<String>> parseSteps() throws IOException {
	// - Extract/persist steps desc and expected results - //
	// extractStepsDescExpectedResultRawData();
    String[] fileNames = { "./app/steps_desc.txt", "./app/expected_res.txt" };
   
    List<ArrayList<String>> stepsContainer = new ArrayList<ArrayList<String>>();
    for (int i = 0; i < fileNames.length; i++) {
      stepsContainer.add(new ArrayList<String>());
      ArrayList<String> steps = stepsContainer.get(i);
      try (Scanner scanner = new Scanner(new File(fileNames[i]))) {
        StringBuilder multiliner = new StringBuilder();
        String lastline = null;
        while (scanner.hasNext()) {
          String line = scanner.nextLine().trim();
          String num = line.split(" ").length > 0 ? line.split(" ")[0] : "";
          num = num.replaceAll("[^0-9]", "");
          if (!num.equals("")) {
            steps.add(line);
          } else {
            if (lastline == null) {
              lastline = steps.get(steps.size() - 1) + line + "\n";
              multiliner.append(lastline);
              steps.set(steps.size() - 1, multiliner.toString());
            } else {
              multiliner.append(line + "\n");
              steps.set(steps.size() - 1, multiliner.toString());
            }
          }
          // - Remove line number - //
          if ((line.startsWith(num + ". "))) {
            line = line.replace(num + ". ", "").trim();
            steps.set(steps.size() - 1, line);
          }
        }
      }
    }

    // System.out.println( container );
    return stepsContainer;
  }

  public static JsonObject getModuleStatistics(String name) throws InterruptedException {
    JsonObject stats = new JsonObject();
    try {
      
      d = QTestCiController.launchLoginQTest(BASE_URL, true);
      
      // - Module name xpath - //
      String xpath = "//test-design-tree//span[text()='"+name+"']";
      waitUntilElementAvailable( xpath ).click();
      // /*
      // - Stats xpath - //
      xpath = "//*[@id='main_pane_testdesign']//span[text()='Statistics']/../../..//table";
      WebElement t = waitUntilElementAvailable( xpath ); // - Retrieve Stats table - //
      xpath = "//td[contains(.,'Test Cases')]//span[@class='sum-text']";
      stats.addProperty("tcs", Integer.parseInt( t.findElement(By.xpath(xpath)).getText()));
      xpath = xpath.replace("Test Cases", "Sub Modules");
      stats.addProperty("sms", Integer.parseInt(t.findElement(By.xpath(xpath)).getText()));
      // */
      
    } finally {
      quit();
    }
    
    return stats;
  }
  
  public static JsonArray getModulesStatistics(JsonArray names) throws InterruptedException {
    JsonArray stats = new JsonArray();
    try {
      d = QTestCiController.launchLoginQTest(BASE_URL, MODE);
      
      for(int i=0; i<names.size(); i++) {
        
        JsonObject stat = new JsonObject();
        stat.addProperty("id", i);
        String name = names.get( i).getAsString();
        stat.addProperty("name", name);
        
        // - Module name xpath - //
        String xpath = "//test-design-tree//span[text()='"+name+"']";
        waitUntilElementAvailable( xpath ).click();
        
        // - Stats xpath - //
        xpath = "//*[@id='main_pane_testdesign']//span[text()='Statistics']/../../..//table";
        WebElement t = waitUntilElementAvailable( xpath ); // - Retrieve Stats table - //
        xpath = "//td[contains(.,'Test Cases')]//span[@class='sum-text']";
        stat.addProperty("tcs", Integer.parseInt( t.findElement(By.xpath(xpath)).getText()));
        xpath = xpath.replace("Test Cases", "Sub Modules");
        stat.addProperty("sms", Integer.parseInt(t.findElement(By.xpath(xpath)).getText()));
        
        stats.add( stat );
      }
    } finally {
      quit();
    }
    
    return stats;
  }  
  
  public static void expandNavTreeNode() {
    String xp = "//*[@data-expanded='false' and not(contains(@class,'expanded')) and contains(@id, '-expand-0')]";
    List<WebElement> ns = waitUntilElementsAvailable(xp, 1);
    for(WebElement n : ns) {
      try {
        jse.executeScript("arguments[0].click();", n);
      } catch (Exception x) {
        x.printStackTrace();
      }
    }
    
    expandNavTreeNode();
  }

  public static String getExpandedNavTreeNodes() {
	 
	  expandAllNavTreeNodes();	// - Expand all navigator tree nodes - //
	  
      String xp = "//*[@id='test-design-tree-content']";
      String cmd = "return arguments[0].outerHTML;";
      String res = (String)jse.executeScript(cmd, waitUntilElementAvailable(xp));
      
      System.out.println("Nav Tree nodes expansion complete!");
      
      return res;
  }
  
  public static void expandAllNavTreeNodes() {
	  try {
		  // - Click Test Design tab - //
		  click("Test Design");
		  
		  // - Begin tree nodes expansion - //
		  System.out.println("Expanding all nav tree nodes...");
		  
		  expandNavTreeNode();
		  
	  } catch( Exception x ) {
		  // x.printStackTrace();
	  }
  }
  
  public static String getModuleSynopsis(String name) 
		  throws InterruptedException {
	  try {
		  expandAllNavTreeNodes();
		  clickNavItem(name);
		  
		  return (String) jse.executeScript(
				  "return arguments[0].outerHTML", waitUntilElementAvailable(
				  QTestCiComponent.getXpath("testDesignPane"), 5));
		  
	  } catch( Exception x ) {
		  x.printStackTrace();
	  }
	  
	  return null;
  }
  
  public static String getTestCase(String name) throws InterruptedException {
	  try {
		  expandAllNavTreeNodes();
		  clickNavItem(name);
		  
		  return (String) jse.executeScript(
				  "return arguments[0].outerHTML", waitUntilElementAvailable(
				  QTestCiComponent.getXpath("testDesignPane"), 5));
		  
	  } catch( Exception x ) {
		  x.printStackTrace();
	  }
	  
	  return null;
  }
  
  public static void main(String[] args) throws Exception {
    d = QTestCiController.launchLoginQTest(TEST_CASE_URL, false);
    QTestCiController.insertStepDescExpectedResultsSteps();
    
    // QTestCiController.getModuleStatistics("To Be Automated");
    /*
      JsonArray jsa = new JsonArray();
      //jsa.add("Automated Tests"); 
      //jsa.add("To Be Automated"); 
      jsa.add("Manual Tests");
    System.out.println( QTestConnect.getFormattedJson( 
        QTestCiController.getModulesStatistics(jsa) ) );
    */
    // QTestCiController.expandAllNavTreeNodes();
    // collapseAllNavTreeNodes
    // System.out.println( QTestCiController.collapseAllNavTreeNodes() );
	  
	  /*
	  // - Test testminateSessions and reLogin methods - //
	  for(int i=0; i<4; i++) {
		  System.out.println( "Launch/log in user..." );
		  launchLoginQTest(QTestCiController.BASE_URL, false);
		  System.out.println( "Launched and user logged in!\nClosing browser..." );
//		  d.close();
//		  System.out.println( "Browser closed!\n" );
	  }
	  */
	  /*
	  try {
		  d = QTestCiController.launchLoginQTest(TEST_DESIGN_URL, false);
		  System.out.println( getExpandedNavTreeNodes() );
//		  System.out.println( jse.executeScript("return arguments[0].outerHTML", 
//				  waitUntilElementAvailable("//*[@id='main_pane_testdesign']", 5)) );
		  
	  } catch(Exception x) {
		  x.printStackTrace();
	  }
	  */
	  
	  // - Test enterCredentials and enter methods - //
	  // d = QTestCiController.launchLoginQTest(BASE_URL, false);
	  // System.out.println( getTestCase("Disable Save Reports link when no filters have been applied") );
  }
}
