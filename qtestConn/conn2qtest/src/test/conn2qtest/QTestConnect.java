package test.conn2qtest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

import org.qas.qtest.api.auth.PropertiesQTestCredentials;
import org.qas.qtest.api.auth.QTestCredentials;
import org.qas.qtest.api.services.design.TestDesignService;
import org.qas.qtest.api.services.design.TestDesignServiceClient;
import org.qas.qtest.api.services.design.model.ListTestCaseRequest;
import org.qas.qtest.api.services.design.model.ListTestStepRequest;
import org.qas.qtest.api.services.design.model.TestCase;
import org.qas.qtest.api.services.design.model.TestStep;
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

public class QTestConnect {

	public static final String QTEST_PROPS_PATH = "./qTestCredentials.properties";
	public static Properties qTestProps = null;
	public static ProjectService projectService = null;
	public static long projectId;
	public static TreeMap<Integer, org.qas.qtest.api.services.project.model.Module> treeMap = 
	    new TreeMap<Integer, org.qas.qtest.api.services.project.model.Module>();
	public static JsonArray jsaModules = new JsonArray();    

	static {
		try {
			initialise();
		} catch(Exception x) {
			x.printStackTrace();
		}
	}

	public static void initialise() throws Exception {
		qTestProps = new Properties(); 
		qTestProps.load( new FileInputStream(QTEST_PROPS_PATH) );
		
		// - Establish connection to project end-point - //
		connectToProjectService();
		
		// - Set project Id - //
		setProjectId();
		
		System.out.println("Process initialsed - " + 
				QTestConnect.class.getCanonicalName() + "...");
	}
	
	public static QTestCredentials getCredentials() throws IOException {
		QTestCredentials credentials = 
				new PropertiesQTestCredentials(new File(QTEST_PROPS_PATH));
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

	public static void observeDisplayProjectModules( String name ) {
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
	           // System.out.println( m.getName() + ", order_no: " + m.getOrder());
	           treeMap.put( m.getOrder(), m);
	         });
	       }
	     });
	     
	     Iterator it = treeMap.navigableKeySet().iterator();
	     while( it.hasNext() ) {
	       org.qas.qtest.api.services.project.model.Module module = treeMap.get(it.next());
           System.out.println("name: " + module.getName());
           JsonObject jsoModule = new JsonObject();
           jsoModule.addProperty("name", module.getName());
           jsoModule.addProperty("id", module.getId());
           jsoModule.addProperty("pId", module.getPid());
           jsaModules.add( jsoModule );
	       observeIterateModule( module, jsoModule );
	     }
	     // Gson gson = new GsonBuilder().setPrettyPrinting().create();
	     // System.out.println( gson.toJson(jsaModules) );
	     observeSort( jsaModules );
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
            jsa.add( _jso );
            observeIterateModule( m, _jso );
          });
        }
	}
	  
	public static void observeSort( JsonArray jsa ) {
      Gson gson = new GsonBuilder().setPrettyPrinting().create();
     Iterator<?> it = jsa.iterator();
     while( it.hasNext() ) {
       System.out.println( gson.toJson(it.next() ));
     }
	}

	public static long getProjectId(String name) {
		long pId = -1;
		ListProjectRequest listProjectRequest = new ListProjectRequest();
		List<Project> projects = projectService.listProject(listProjectRequest);
		for( Project project : projects ) {
			if( project.getName().equals( name ) ) {
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

	public static void main(String[] args) throws Exception {
	  observeDisplayProjectModules("Compass Portal - Beer ");
	  // displayProjects();
		// System.out.println(observeGetTestCaseByName("Temp: TestCase - FOR TEST PURPOSES ONLY"));
	  // observeRetrieveTestCasesFromModule("To Be Automated");
	}
}
