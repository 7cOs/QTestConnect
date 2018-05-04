package test.conn2qtest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.qas.qtest.api.auth.PropertiesQTestCredentials;
import org.qas.qtest.api.auth.QTestCredentials;
import org.qas.qtest.api.internal.model.Link;
import org.qas.qtest.api.services.design.TestDesignService;
import org.qas.qtest.api.services.design.TestDesignServiceClient;
import org.qas.qtest.api.services.design.model.ListTestCaseRequest;
import org.qas.qtest.api.services.design.model.TestCase;
import org.qas.qtest.api.services.project.ProjectService;
import org.qas.qtest.api.services.project.ProjectServiceClient;
import org.qas.qtest.api.services.project.model.GetModuleRequest;
import org.qas.qtest.api.services.project.model.ListModuleRequest;
import org.qas.qtest.api.services.project.model.ListProjectRequest;
import org.qas.qtest.api.services.project.model.Project;

public class QTestConnect {

	public static final String QTEST_PROPS_PATH = "./qTestCredentials.properties";
	public static Properties qTestProps = null;
	public static ProjectService projectService = null;

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
		
		connectToProjectService();
		
		System.out.println("Process initialsed - " + 
				QTestConnect.class.getCanonicalName()+"...");
	}
	
	public static QTestCredentials getCredentials() throws IOException {
		QTestCredentials credentials = 
				new PropertiesQTestCredentials(new File(QTEST_PROPS_PATH));
		return credentials;	
	}
	
	public static void connectToProjectService() throws IOException {
		projectService = new ProjectServiceClient(getCredentials());
		projectService.setEndpoint(qTestProps.getProperty("serviceEndPoint"));
		System.out.println( "Connected to ProcessService: " + projectService );
		/*ListModuleRequest listModuleRequest = new ListModuleRequest();
		listModuleRequest.withProjectId(68329L).withIncludeDescendants(true);
		System.out.println( "-- Modules --" );
		List<org.qas.qtest.api.services.project.model.Module> ms = 
				projectService.listModule(listModuleRequest);
		for(org.qas.qtest.api.services.project.model.Module m : ms ) {
			System.out.println("Name: "+m.getName()+", Id: "+m.getId()+", pId: "+m.getPid());
			// - Isolate - //
			if( m.getName().equals("To Be Automated") ) {
				System.out.println( m.getChildren().size() );
				break;
			}
		}*/
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
	
	public static void observeTestDesignService() throws IOException {
		QTestCredentials credentials = 
				new PropertiesQTestCredentials(new File(QTEST_PROPS_PATH));
		TestDesignService testDesignService = new TestDesignServiceClient(credentials);
		// - Attempt to list test cases - //
		ListTestCaseRequest listTestCaseRequest = new ListTestCaseRequest();
		listTestCaseRequest
			.withProjectId(68329L)
			.withModuleId( 4823877L );
		
		List<TestCase> testcases = testDesignService.listTestCase(listTestCaseRequest);
		System.out.println( "TestCase(s)" );
		for( TestCase testcase : testcases ) {
			System.out.println( "Name: " + testcase.getName() );
			System.out.println( "Id: " + testcase.getId() );
			System.out.println( "URL: " + testcase.getWebUrl() );
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
	
	public static long getModuleId(String name, long pId) {
		long mId = -1;
		if( pId > -1 ) {
			ListModuleRequest listModuleRequest = new ListModuleRequest();
			listModuleRequest.withProjectId(pId).withIncludeDescendants(true);
			List<org.qas.qtest.api.services.project.model.Module> modules = 
					projectService.listModule(listModuleRequest);
			for(org.qas.qtest.api.services.project.model.Module module : modules) {
				if( module.getName().equals(name) ) {
					mId = module.getId();
					System.out.println("Located Id ["+mId+"] for module '"+name+"'");
					break;
				}
			}
		}
		return mId;
	}
	
	
	public static void observeRetrieveTestCaseFromModule(long mId) throws IOException {
		GetModuleRequest getModuleRequest = 
				new GetModuleRequest()
				.withProjectId(68329L)
				.withModuleId(mId)
				.withIncludeDescendants(true);
		org.qas.qtest.api.services.project.model.Module module;
		module = projectService.getModule(getModuleRequest);
		module.getChildren().forEach(m -> {
			for( int i = 0; i<m.getLinks().size(); i++ ) {
				Link link = m.getLinks().get(i);
				System.out.println( link );
			}
		});
		
	}
	
	
	
	public static void main(String[] args) throws Exception {
		// connectToProjectService();		
		// displayProjects();
		// observeTestDesignService();
		// getProjectId("Compass Portal - Beer ");
		long mId = getModuleId("To Be Automated", 
				getProjectId("Compass Portal - Beer "));
		
		observeRetrieveTestCaseFromModule(mId);
	}

}
