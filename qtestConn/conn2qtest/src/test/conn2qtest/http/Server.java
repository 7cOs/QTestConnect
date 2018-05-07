package test.conn2qtest.http;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import test.conn2qtest.QTestConnect;

public class Server {
	public static void start() {
		try {
			HttpServer server = HttpServer.create(new InetSocketAddress(7199), 0);
	        server.createContext("/", new App());
	        server.createContext("/fetchQtestTestcase", new Featcher());
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
	
    public static class Featcher implements HttpHandler {
      @Override
      public void handle(HttpExchange t) throws IOException {
        try {
          QTestConnect.observeGetTestCaseByName(
              "Temp: TestCase - FOR TEST PURPOSES ONLY");
        } catch (Exception e) {
          e.printStackTrace();
        }
        /*String p = "./app/app.htm";
        String r = new String(Files.readAllBytes(Paths.get(p)));
        t.sendResponseHeaders(200, r.length());
        try (OutputStream os = t.getResponseBody()) {
          os.write(r.getBytes());
        }*/
      }
    }

	public static void main(String[] args) throws IOException {
		Server.start();
	}
}
