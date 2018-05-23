package test.conn2qtest.qtest.ci;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
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
  
  public static final String TC_TEMP_URL = "https://cbrands.qtestnet.com/p/68329/portal/project#tab=testdesign&object=1&id=23057777";
  public static final String TC_ACTUAL_URL = "https://cbrands.qtestnet.com/p/68329/portal/project#tab=testdesign&object=1&id=22986021";
  public static WebDriver d;
  public static final boolean MODE = true;
  public static final int WAIT = 35;
  public static JavascriptExecutor jse = null;
  
  public static WebDriver launchLoginQTest(String url, boolean mode) throws InterruptedException {
    System.setProperty("webdriver.chrome.driver", "./app/chromedriver.exe");

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

    Thread.sleep(1525);

    return d;
  }
  
  public static void waitUntilPageLoadComplete() {
    new WebDriverWait(d, WAIT).until(
        webDriver -> ((JavascriptExecutor) webDriver)
        .executeScript("return document.readyState").equals("complete"));    
  }
  
  public static WebElement waitUntilElementAvailable(String xpath) {
    return new WebDriverWait(d, WAIT).until(ExpectedConditions
        .visibilityOfElementLocated(By.xpath(xpath)));
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
    d.findElement(By.id("testdesignToolbarSave")).click();

    return false;
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
      
      d = QTestCiController.launchLoginQTest(TC_TEMP_URL, MODE);
      
      // - Module name xpath - //
      String xpath = "//test-design-tree//span[text()='"+name+"']";
      d.findElement(By.xpath(xpath)).click();
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
      d = QTestCiController.launchLoginQTest(TC_TEMP_URL, MODE);  
      
      for(int i=0; i<names.size(); i++) {
        
        JsonObject stat = new JsonObject();
        stat.addProperty("id", i);
        String name = names.get( i).getAsString();
        stat.addProperty("name", name);
        
        // - Module name xpath - //
        String xpath = "//test-design-tree//span[text()='"+name+"']";
        d.findElement(By.xpath(xpath)).click();
        
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
  
  public static void main(String[] args) throws Exception {
    // d = QTestCiController.launchLoginQTest(TC_TEMP_URL, MODE);
    // QTestCiController.insertStepDescExpectedResultsSteps();
    // QTestCiController.getModuleStatistics("To Be Automated");
    /*JsonArray jsa = new JsonArray();
      jsa.add("Automated Tests"); 
      jsa.add("To Be Automated"); 
      jsa.add("Manual Tests");
    System.out.println( QTestConnect.getFormattedJson( 
        QTestCiController.getModulesStatistics(jsa) ) );
    */
  }
}
