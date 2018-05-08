package test.conn2qtest.http;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.qas.qtest.api.services.design.model.TestCase;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import test.conn2qtest.QTestConnect;

public class Server {
	public static void start() {
		try {
			HttpServer server = HttpServer.create(new InetSocketAddress(7199), 0);
	        server.createContext("/", new App());
	        server.createContext("/fetchQtestTestcase", new Fetcher());
	        server.setExecutor(null);
	        server.start();	
	        System.out.println( "Web server started on " + server.getAddress() );
		} catch (Exception x) {
			x.printStackTrace();
		}
	}

	public static class App implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
        	String p = "./app/app.htm";
            String r = new String(Files.readAllBytes(Paths.get(p)));
            t.sendResponseHeaders(200, r.length());
            try(OutputStream os = t.getResponseBody()){
              os.write(r.getBytes());
            }
        }
	}
	
    public static class Fetcher implements HttpHandler {
      @Override
      public void handle(HttpExchange t) throws IOException {
        try {
          TestCase testCase = QTestConnect.observeGetTestCaseByName(
              // "Temp: TestCase - FOR TEST PURPOSES ONLY");
              // Create Opportunity with a custom opportunity type and custom Rationale, and add to target list
              "Create Opportunity with a custom opportunity type and custom Rationale, and add to target list");
          String resp = "";
          if(testCase != null) {
            resp = "Located TestCase: " + testCase.getName() + "!";
          } else {
            resp = "TestCase Not Found!";
          }
          t.sendResponseHeaders(200, resp.length());
          try (OutputStream os = t.getResponseBody()) {
            os.write(resp.getBytes());
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }

	public static void main(String[] args) throws IOException {
		Server.start();
	}
}
