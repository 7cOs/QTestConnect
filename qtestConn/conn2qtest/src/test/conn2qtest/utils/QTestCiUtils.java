package test.conn2qtest.utils;

import com.google.gson.JsonObject;

public class QTestCiUtils {
	
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
}
