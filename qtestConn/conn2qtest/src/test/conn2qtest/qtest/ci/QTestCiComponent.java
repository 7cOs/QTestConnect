package test.conn2qtest.qtest.ci;

public final class QTestCiComponent {

	public static String getXpath(String name) {
		String xp = null;
		switch( name ) {
		case "userName":
			xp = "//*[@id='"+name+"']";
			break;
		case "password":
			xp = "//*[@id='"+name+"']";
			break;	
		case "log in":
			xp = "//*[@class='submit']/a";
			break;
		case "Test Design":
			xp = "//*[@id='working-tab']//*[text()='"+name+"']";
			break;
		}
		
		return xp;
	}
}
