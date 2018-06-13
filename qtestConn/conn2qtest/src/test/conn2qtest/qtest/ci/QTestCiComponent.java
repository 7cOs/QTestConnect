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
		case "Go":
			xp = "//*[@id='activeSessionDialog']//button[@id='reloginBtn']";
			break;
		case "Test Design":
			xp = "//*[@id='working-tab']//*[text()='"+name+"']";
			break;
		case "navTreeNodes":
			xp = "//*[@id='test-design-tree-content']";
			break;
		case "navTreeNode":
			xp = QTestCiComponent.getXpath("navTreeNodes") +
				"//*[text()='[Name]']";
			break;
		case "isLoading":
			xp = "//*[@id='loadingOverlay']";
			break;
		case "testDesignPane":
			xp = "//*[@id='main_pane_testdesign']//*[contains(@class, 'rc-content-wrapper')]/../../..";
			break;
		case "Step description":
		case "Expected result":
			xp = "//div[@class='gridxSortNode' and text()='"+name+"']/..";
			break;
		case "gridColDataRaw":
			xp = "//*[@class='gridxRow']//tr//td[INDEX]";
			break;
		}
		
		return xp;
	}
}
