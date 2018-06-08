package test.conn2qtest.qtest.ci;

import java.io.File;
import java.io.FileNotFoundException;
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

import net.minidev.json.JSONArray;
import test.conn2qtest.QTestConnect;

public class QTestCiController {
  
  public static final String BASE_URL = QTestCiData.getString(QTestCiData.get("baseURL"));
  public static final String TEST_DESIGN_URL = QTestCiData.getString(QTestCiData.get("compassPortalTestDesignURL"));
  public static final String TEST_CASE_URL = QTestCiData.getString(QTestCiData.get("compassPortalTestCaseURL"));
  public static final boolean MODE = QTestCiData.getBoolean(QTestCiData.get("isSilentMode"));
  public static final int WAIT = QTestCiData.getInt(QTestCiData.get("wait"));
  
  public static WebDriver d, controller;
  public static JavascriptExecutor jse = null;
  
  public static boolean ciControllerStarted = false;
  public static boolean sessionsTerminated = false;
  
  public static WebDriver launchLoginQTest(String url, boolean mode) 
		  throws InterruptedException {
	JsonObject dps = QTestCiData.getJso(QTestCiData.get("driverProps"));
    System.setProperty(dps.get("name").getAsString(), dps.get("path").getAsString());

    ChromeOptions os = new ChromeOptions();
    os.setHeadless( mode );
    
    d = new ChromeDriver( os ); 
    jse = (JavascriptExecutor) d;
    d.navigate().to(url);
    d.manage().window().maximize();

    waitUntilPageLoadComplete();

    // - Login - //
    d.findElement(By.id("userName")).sendKeys("soko.karnesh@cbrands.com");
    d.findElement(By.id("password")).sendKeys("test1@7197c");
    d.findElement(By.xpath("//*[@class='submit']/a")).click();

    waitUntilPageLoadComplete();
    
    // - Terminate existing sessions if applicable - //
    terminateSessions(url, mode);

    pause(1525);

    return d;
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
	  String xpath = "//*[@id='activeSessionDialog']//button[@id='reloginBtn']";
	  try {
		  waitUntilElementAvailable(xpath, 1).click();
		  waitUntilPageLoadComplete();
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
  
  public static void click(String name) {
	  
	  jse.executeScript("arguments[0].click();", 
			  waitUntilElementAvailable(name, 5) );
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
      throws FileNotFoundException, InterruptedException {

    try {
      List<ArrayList<String>> stepsContainer = parseSteps();
  
      d = QTestCiController.launchLoginQTest(TEST_CASE_URL, false);
      
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
      d.findElement(By.id("testdesignToolbarSave")).click();
      return true;
    }
    finally {
      quit();
    } 
  }
  
  public static List<ArrayList<String>> parseSteps() throws FileNotFoundException {
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
		  click("//*[@id='working-tab']//*[text()='Test Design']");
		  
		  // - Begin tree nodes expansion - //
		  System.out.println("Expanding all nav tree nodes...");
		  
		  expandNavTreeNode();
	  } catch( Exception x ) { }
  }
  
  public static void getModuleSynopsis( String name ) throws InterruptedException {
	  try {
		  
	  }catch( Exception x ) {
		  x.printStackTrace();
	  }
  }
  
  public static void main(String[] args) throws Exception {
    // d = QTestCiController.launchLoginQTest(TC_ACTUAL_URL, false);
    // QTestCiController.insertStepDescExpectedResultsSteps();
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
		  launchLoginQTest(QTestCiController.COMPASS_PORTAL_URL, true);
		  System.out.println( "Launched and user logged in!\nClosing browser..." );
		  d.close();
		  System.out.println( "Browser closed!\n" );
	  }
	  */
	  try {
		  d = QTestCiController.launchLoginQTest(TEST_DESIGN_URL, false);
		  System.out.println( getExpandedNavTreeNodes() );
//		  System.out.println( jse.executeScript("return arguments[0].outerHTML", 
//				  waitUntilElementAvailable("//*[@id='main_pane_testdesign']", 5)) );
		  
	  } catch(Exception x) {
		  x.printStackTrace();
	  }
  }
}
