package test.conn2qtest.qtest.ci;

import com.google.gson.JsonObject;

public final class QTestCiCfgData {
	
	public static Object get(String key) {
		Object data = null;
		switch( key ) {
		case "baseURL":
			data = "https://cbrands.qtestnet.com";
			break;
		case "compassPortalPath":
			data = "/p/68329/portal/project";
			break;
		case "testDesignPath":
			data = "#tab=testdesign&object=";
			break;
		case "compassPortalTestDesignURL":
			data = String.format("%s%s%s", 
					QTestCiCfgData.get("baseURL"), 
					QTestCiCfgData.get("compassPortalPath"),
					QTestCiCfgData.get("testDesignPath"));
			break;
		case "compassPortalTestCaseURL":
			String tcId = "22758615";
			data = String.format("%s%s%s", 
					QTestCiCfgData.get("compassPortalTestDesignURL"),"1&id=", tcId);
			break;
		case "isSilentMode":
			data = true;
			break;
		case "prolix":
			data = true;
			break;			
		case "wait":
			data = 35;
			break;
		case "driverProps":
			data = new JsonObject();
			((JsonObject) data).addProperty("name", "webdriver.chrome.driver");
			((JsonObject) data).addProperty("path", "./app/chromedriver.exe");
			break;	
		case "credentials":
			data = new JsonObject();
			((JsonObject) data).addProperty("username", "soko.karnesh@cbrands.com");
			((JsonObject) data).addProperty("password", "test1@7197c");
			break;
		}
		
		return data;
	}
	
	public static String getString(Object data) {
		return (String) data;
	}
	
	public static int getInt(Object data) {
		return (int) data;
	}
	
	public static boolean getBoolean(Object data) {
		return (boolean) data;
	}
	
	public static JsonObject getJso(Object data) {
		return (JsonObject) data;
	}

	public static void main(String[] args) {
		System.out.println(QTestCiCfgData.get("compassPortalTestDesignURL"));
		System.out.println(QTestCiCfgData.get("compassPortalTestCaseURL"));
		System.out.println(QTestCiCfgData.get("credentials"));
		System.out.println(QTestCiCfgData.getJso(QTestCiCfgData.get("driverProps")));
		JsonObject dps = QTestCiCfgData.getJso(QTestCiCfgData.get("driverProps"));
	    System.out.format("fission.driver:\nname = %s, path = %s", dps.get("name").getAsString(), dps.get("path").getAsString());
	}
}
