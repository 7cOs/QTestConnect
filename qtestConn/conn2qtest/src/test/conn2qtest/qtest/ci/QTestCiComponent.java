package test.conn2qtest.qtest.ci;

public final class QTestCiComponent {

	public static String getXpath(String name) {
		String xp = null;
		switch( name ) {
		case "username":
			xp = "//*[@id='userName']";
			break;
		case "password":
			xp = "//*[@id='"+name+"']";
			break;	
		case "Log In":
			xp = "//*[@class='submit']/a";
			break;
		case "Test Design":
			xp = "//*[@id='working-tab']//*[text()='"+name+"']";
			break;
		}
		
		return xp;
	}
}
