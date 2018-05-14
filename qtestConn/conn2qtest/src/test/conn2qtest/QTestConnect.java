package test.conn2qtest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.stream.Stream;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.qas.api.ApiServiceRequest;
import org.qas.api.Credentials;
import org.qas.qtest.api.auth.PropertiesQTestCredentials;
import org.qas.qtest.api.auth.QTestCredentials;
import org.qas.qtest.api.internal.model.FieldValue;
import org.qas.qtest.api.services.authenticate.model.AuthenticateRequest;
import org.qas.qtest.api.services.design.TestDesignService;
import org.qas.qtest.api.services.design.TestDesignServiceClient;
import org.qas.qtest.api.services.design.model.CreateTestCaseRequest;
import org.qas.qtest.api.services.design.model.ListTestCaseRequest;
import org.qas.qtest.api.services.design.model.ListTestStepRequest;
import org.qas.qtest.api.services.design.model.TestCase;
import org.qas.qtest.api.services.design.model.TestStep;
import org.qas.qtest.api.services.design.model.UpdateTestCaseRequest;
import org.qas.qtest.api.services.project.ProjectService;
import org.qas.qtest.api.services.project.ProjectServiceClient;
import org.qas.qtest.api.services.project.model.GetModuleRequest;
import org.qas.qtest.api.services.project.model.ListModuleRequest;
import org.qas.qtest.api.services.project.model.ListProjectRequest;
import org.qas.qtest.api.services.project.model.Project;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class QTestConnect {

	public static final String path_qtest_props = "./qTestCredentials.properties";
	public static Properties qTestProps = null;
	public static ProjectService projectService = null;
	public static long projectId;
	public static TreeMap<Integer, org.qas.qtest.api.services.project.model.Module> treeMap = 
	    new TreeMap<Integer, org.qas.qtest.api.services.project.model.Module>();
	// public static JsonArray jsaModules = new JsonArray(); 
	public static Gson gson = new GsonBuilder().setPrettyPrinting().create();

	static {
		try {
			initialise();
		} catch(Exception x) {
			x.printStackTrace();
		}
	}

	public static void initialise() throws Exception {
		qTestProps = new Properties(); 
		qTestProps.load( new FileInputStream(path_qtest_props) );
		
		// - Establish connection to project end-point - //
		connectToProjectService();
		
		// - Set project Id - //
		setProjectId();
		
		// - Set 
		gson = new GsonBuilder().setPrettyPrinting().create();
		
		System.out.println("Process initialsed - " + 
				QTestConnect.class.getCanonicalName() + "...");
	}
	
	public static QTestCredentials getCredentials() throws IOException {
		QTestCredentials credentials = 
				new PropertiesQTestCredentials(new File(path_qtest_props));
		return credentials;	
	}
	
	public static void connectToProjectService() throws IOException {
		projectService = new ProjectServiceClient(getCredentials());
		projectService.setEndpoint(qTestProps.getProperty("serviceEndPoint"));
		System.out.println("Connected to ProjectService: " + projectService);
	}
	
	public static void setProjectId() {
		projectId = getProjectId(qTestProps.getProperty("defaultProject"));
	}
	
	public static void displayProjects() {
		ListProjectRequest listProjectRequest = new ListProjectRequest();
		List<Project> projects = projectService.listProject(listProjectRequest);
		System.out.println( "Located [" + projects.size() + "] Project(s)...\n" );
		// - Iterate; print out Name & Description - //
		for( Project project : projects ) {
			System.out.println("Project: "+project.getName()+
					"\nDescription: " + project.getDescription()+
					"\nId: " + project.getId());
			System.out.println("URL: " +project.getWebUrl());
			System.out.println( "-- Properties --" );
			Map<String, Object> m = project.getProperties();
			Iterator<String> it = m.keySet().iterator();
			while( it.hasNext() ) {
				String k = it.next();
				Object v = m.get(k);
				System.out.println( "k="+k + ", v="+v );
			}
			System.out.println("");
		}
	}

	public static String observeGetProjects() {
		ListProjectRequest listProjectRequest = new ListProjectRequest();
		List<Project> projects = projectService.listProject(listProjectRequest);
		JsonObject results = new JsonObject();
		results.addProperty("total",  projects.size());
		JsonArray items = new JsonArray();
		results.add("items", items);
		for( Project project : projects ) {
			JsonObject item = new JsonObject();
			items.add( item );
			item.addProperty("id", project.getId());
			item.addProperty("name", project.getName());
		}
		
		return getFormattedJson(results) ;
	}
	
	public static String observeGetProjectModules( String name ) {
		
		JsonArray results = new JsonArray(); 
		
	     ListProjectRequest listProjectRequest = new ListProjectRequest();
	     List<Project> projects = projectService.listProject(listProjectRequest);
	     System.out.println( "Located [" + projects.size() + "] Project(s)...\n" );
	     projects.forEach( p -> {
	       String n = p.getName();
	       if( p.getName().equals(name) ) {
	         System.out.println( "Located ProjectName: " + n + "!");
	         ListModuleRequest listModuleRequest = new ListModuleRequest();
	         listModuleRequest.withProjectId(p.getId()).withIncludeDescendants(true);
	         List<org.qas.qtest.api.services.project.model.Module> modules = 
	                projectService.listModule(listModuleRequest);
	         modules.forEach( m -> {
	           treeMap.put( m.getOrder(), m);
	         });
	       }
	     });
	     
	     Iterator<Integer> it = treeMap.navigableKeySet().iterator();
	     while( it.hasNext() ) {
	       org.qas.qtest.api.services.project.model.Module module = treeMap.get(it.next());
          JsonObject jsoModule = new JsonObject();
          jsoModule.addProperty("name", module.getName());
          jsoModule.addProperty("id", module.getId());
          jsoModule.addProperty("pId", module.getPid());
          results.add( jsoModule );
	       observeIterateModule( module, jsoModule );
	     }

	     return getFormattedJson(results);
	}	
	
    public static Project observeGetProjectById(long id) {
      ListProjectRequest listProjectRequest = new ListProjectRequest();
      List<Project> projects = projectService.listProject(listProjectRequest);
 
      for( Project project : projects ) {
        if( project.getId() == id ) {
          return project;
        }
      }

      return null;
  }	
	
	public static void observeGetAllProjectTestCases( long pId ) {
	  
	  Project project = observeGetProjectById(pId);
	  
	  
      JsonObject result = new JsonObject();
	}
	
	
	
	public static void observeDisplayProjectModules( String name ) {
		
		final JsonArray jsaModules = new JsonArray();
		
	     ListProjectRequest listProjectRequest = new ListProjectRequest();
	     List<Project> projects = projectService.listProject(listProjectRequest);
	     System.out.println( "Located [" + projects.size() + "] Project(s)...\n" );
	     projects.forEach( p -> {
	       String n = p.getName();
	       if( p.getName().equals(name) ) {
	         System.out.println( "Located ProjectName: " + n + "!");
	         ListModuleRequest listModuleRequest = new ListModuleRequest();
	         listModuleRequest.withProjectId(p.getId()).withIncludeDescendants(true);
	         List<org.qas.qtest.api.services.project.model.Module> modules = 
	                projectService.listModule(listModuleRequest);
	         modules.forEach( m -> {
	           treeMap.put( m.getOrder(), m);
	         });
	       }
	     });
	     
	     Iterator<Integer> it = treeMap.navigableKeySet().iterator();
	     while( it.hasNext() ) {
	       org.qas.qtest.api.services.project.model.Module module = treeMap.get(it.next());
           // System.out.println("name: " + module.getName());
           JsonObject jsoModule = new JsonObject();
           jsoModule.addProperty("name", module.getName());
           jsoModule.addProperty("id", module.getId());
           jsoModule.addProperty("pId", module.getPid());
           jsaModules.add( jsoModule );
	       observeIterateModule( module, jsoModule );
	     }

	     System.out.println(( gson.toJson(jsaModules) ));
	}
	
	 public static void observeIterateModule(org.qas.qtest.api.services.project.model.Module module, JsonObject jso) {
	  if( module.getChildren() != null && module.getChildren().size() > 0 ) {
    	  List<org.qas.qtest.api.services.project.model.Module> modules = module.getChildren();
    	  JsonArray jsa = new JsonArray();
    	  jso.add("modules", jsa);
          modules.forEach( m -> {
            JsonObject _jso =  new JsonObject();
            _jso.addProperty("order", m.getOrder());
            _jso.addProperty("name", m.getName());
            _jso.addProperty("id", m.getId());
            _jso.addProperty("pId", m.getParentId());
            jsa.add( _jso );
            observeIterateModule( m, _jso );
          });
        }
	}

	public static long getProjectId(String name) {
		long pId = -1;
		ListProjectRequest listProjectRequest = new ListProjectRequest();
		List<Project> projects = projectService.listProject(listProjectRequest);
		for( Project project : projects ) {
			if( project.getName().equals(name)) {
				pId = project.getId();
				System.out.println("Located Id ["+pId+"] for project '"+name+"'");
				break;
			}
		}
		return pId;
	}
	
	public static long getModuleId(String name) {
		long mId = -1;
		ListModuleRequest listModuleRequest = new ListModuleRequest();
		listModuleRequest.withProjectId(projectId).withIncludeDescendants(true);
		List<org.qas.qtest.api.services.project.model.Module> modules = 
				projectService.listModule(listModuleRequest);
		for(org.qas.qtest.api.services.project.model.Module module : modules) {
			if( module.getName().equals(name) ) {
				mId = module.getId();
				System.out.println("Located Id ["+mId+"] for module '"+name+"'");
				break;
			}
		}
		return mId;
	}

	public static void observeRetrieveTestCasesFromModule(String name) throws Exception {
		GetModuleRequest getModuleRequest = 
				new GetModuleRequest()
				.withProjectId(projectId)
				.withModuleId(getModuleId(name))
				.withIncludeDescendants(true);
		org.qas.qtest.api.services.project.model.Module module;
		module = projectService.getModule(getModuleRequest);
		observeExtractTestCases( module );
	}

	public static void observeExtractTestCases(org.qas.qtest.api.services.project.model.Module module) throws IOException {
		System.out.println( "testcase: " + module.getName() + ", order_no: " + module.getOrder() );
		TestDesignService testDesignService = new TestDesignServiceClient(getCredentials());
		ListTestCaseRequest listTestCaseRequest = new ListTestCaseRequest();
		listTestCaseRequest.setProjectId(projectId);
		listTestCaseRequest.setModuleId(module.getId());
		List<TestCase> testcases = testDesignService.listTestCase(listTestCaseRequest);
		if( testcases != null && testcases.size() > 0 ) {
			System.out.println("Located ["+testcases.size()+"] testcase(s) for '"+module.getName()+"'");	
			testcases.forEach(item -> {
				ListTestStepRequest listTestStepRequest = new ListTestStepRequest();
				listTestStepRequest
					.withProjectId(projectId)
					.withTestCaseId(item.getId())
					.withTestCaseVersion(item.getTestCaseVersionId());
				List<TestStep> testSteps = testDesignService.listTestStep(listTestStepRequest);
				int stepsCount = testSteps.size();
				System.out.println(" name: "+item.getName()+", steps: "+stepsCount);
			});
		}
		List<org.qas.qtest.api.services.project.model.Module> modules = module.getChildren();
		if( modules != null ) {
			modules.forEach( item -> {
				try {
					observeExtractTestCases( item );
				} catch (IOException e) {
					e.printStackTrace();
				}
			});
		}
	}

	// - Preliminary - //
	public static TestCase testcase;
	public static TestCase observeGetTestCaseByName(String name) throws Exception {
		ListModuleRequest listModuleRequest = new ListModuleRequest();
		listModuleRequest.withProjectId(projectId).withIncludeDescendants(true);
		List<org.qas.qtest.api.services.project.model.Module> modules = 
				projectService.listModule(listModuleRequest);
		for(org.qas.qtest.api.services.project.model.Module module : modules) {
			observeGetTestCase(name, module);
		}
		return testcase;
	}

	public static void observeGetTestCase(String name, 
			org.qas.qtest.api.services.project.model.Module module) throws Exception {
		TestDesignService testDesignService = new TestDesignServiceClient(getCredentials());
		ListTestCaseRequest listTestCaseRequest = new ListTestCaseRequest();
		listTestCaseRequest.setProjectId(projectId);
		listTestCaseRequest.setModuleId(module.getId());
		List<TestCase> testcases = testDesignService.listTestCase(listTestCaseRequest);
		if( testcases != null && testcases.size() > 0 ) {
			testcases.forEach(item -> {
				if(item.getName().equals(name)) {
					testcase = item;
					System.out.println("Located '"+item.getName()+"'!");
					return;
				}
			});
		}
		
		if( testcase !=null ) { return; }
		
		List<org.qas.qtest.api.services.project.model.Module> modules = module.getChildren();
		if( modules != null ) {
			modules.forEach( item -> {
				try {
					observeGetTestCase(name, item);
				} catch (Exception e) {
					e.printStackTrace();
				}
			});
		}		
	}

	public static String getFormattedJson( Object o ) {
		return new GsonBuilder().setPrettyPrinting().create().toJson(o);
	}

  public static WebDriver launchLoginQTest(String url, boolean mode ) throws InterruptedException {
    System.setProperty("webdriver.chrome.driver", "./app/chromedriver.exe");

    ChromeOptions os = new ChromeOptions();
    os.setHeadless( mode );
    
    WebDriver d = new ChromeDriver( os );
    d.navigate().to(url);
    d.manage().window().maximize();

    // - Wait until page loads - //
    new WebDriverWait(d, 35).until(
        webDriver -> ((JavascriptExecutor) webDriver).executeScript("return document.readyState").equals("complete"));

    // - Login - //
    d.findElement(By.id("userName")).sendKeys("soko.karnesh@cbrands.com");
    d.findElement(By.id("password")).sendKeys("test1@7197c");
    d.findElement(By.xpath("//*[@class='submit']/a")).click();

    // - Wait until page loads - //
    new WebDriverWait(d, 35).until(
        webDriver -> ((JavascriptExecutor) webDriver).executeScript("return document.readyState").equals("complete"));

    Thread.sleep(1525);

    return d;
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

  public static boolean insertStepDescExpectedResultsSteps(WebDriver d)
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

  public static void main(String[] args) throws Exception {

    // https://cbrands.qtestnet.com/api/v3/projects/68329

    // observeGetAllProjectTestCases(68329);
    // observeDisplayProjectModules("Compass Portal - Beer ");
    // displayProjects();
    // observeRetrieveTestCasesFromModule("To Be Automated");
    // System.out.println(observeGetProjects());

    TestCase testcase = observeGetTestCaseByName("Temp: TestCase - FOR TEST PURPOSES ONLY");
    System.out.println( testcase.getWebUrl() );

    // String url = "https://cbrands.qtestnet.com/p/68329/portal/project#tab=testdesign&object=1&id=22986021";
    //String url = "https://cbrands.qtestnet.com/p/68329/portal/project#tab=testdesign&object=1&id=23057777";
    //WebDriver d = launchLoginQTest(url,false);
    //insertStepDescExpectedResultsSteps(d);
  }
}
