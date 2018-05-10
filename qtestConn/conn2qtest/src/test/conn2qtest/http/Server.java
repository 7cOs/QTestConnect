package test.conn2qtest.http;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.io.IOUtils;
import org.qas.qtest.api.services.design.model.TestCase;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import test.conn2qtest.QTestConnect;

public class Server {
	public static void start() {
		try {
			HttpServer server = HttpServer.create(new InetSocketAddress(7199), 0);
			// - Client-interface services - //
			server.createContext("/", new App());
			server.createContext("/modules.js", new App());
			// - QTestConnect Services - //
			server.createContext("/fetchProjects", new Fetcher());
			server.createContext("/fetchProject", new Fetcher());
			server.createContext("/fetchModules", new Fetcher());
			server.createContext("/fetchModule", new Fetcher());
			server.createContext("/fetchTestCases", new Fetcher());
			server.createContext("/fetchTestCase", new Fetcher());
			server.setExecutor(null);
			server.start();
			System.out.println("Web server started on " + server.getAddress());
		} catch (Exception x) {
			x.printStackTrace();
		}
	}

	public static class App implements HttpHandler {
		@Override
		public void handle(HttpExchange t) throws IOException {
			String p = "./app/app.htm";
			if (t.getHttpContext().getPath().equals("/modules.js")) {
				p = "./app" + t.getHttpContext().getPath();
			}
			String r = new String(Files.readAllBytes(Paths.get(p)));
			t.sendResponseHeaders(200, r.length());
			try (OutputStream os = t.getResponseBody()) {
				os.write(r.getBytes());
			}
		}
	}

	public static class Fetcher implements HttpHandler {
		@Override
		public void handle(HttpExchange t) throws IOException {
			try {

				String reqPath = t.getHttpContext().getPath();
				String reqArgs = IOUtils.toString(t.getRequestBody(), StandardCharsets.UTF_8);
				String resp = "";

				switch (reqPath) {
				case "/fetchProjects":
					resp = QTestConnect.observeGetProjects();
					break;
				case "/fetchProject":
					resp = QTestConnect.observeGetProjects();
					break;
				case "/fetchModules":
					JsonObject jso = new JsonParser().parse(reqArgs).getAsJsonObject();
					resp = QTestConnect.observeGetProjectModules(jso.get("name").getAsString());
					break;						
				case "/fetchTestCase":
					TestCase testCase = QTestConnect.observeGetTestCaseByName(
							// "Temp: TestCase - FOR TEST PURPOSES ONLY");
							"Create Opportunity with a custom opportunity type and custom Rationale, and add to target list");
					if (testCase != null) {
						resp = "Success: " + testCase.getName() + " located!";
					} else {
						resp = "Error: TestCase Not Found!";
					}
					break;
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
