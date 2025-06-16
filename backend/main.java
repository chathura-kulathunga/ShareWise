package backend;

import fi.iki.elonen.NanoHTTPD;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Main extends NanoHTTPD {

    public Main() throws IOException {
        super(8080); // Server listens on port 8080
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("🚀 ShareWise backend running at http://localhost:8080");
    }

    public static void main(String[] args) {
        try {
            new Main();
        } catch (IOException e) {
            System.err.println("❌ Failed to start server");
            e.printStackTrace();
        }
    }

    @Override
    public Response serve(IHTTPSession session) {
        // Allow preflight CORS request (from browser)
        if (Method.OPTIONS.equals(session.getMethod())) {
            Response res = newFixedLengthResponse("");
            res.addHeader("Access-Control-Allow-Origin", "*");
            res.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            res.addHeader("Access-Control-Allow-Headers", "Content-Type");
            return res;
        }

        if (Method.POST.equals(session.getMethod()) && "/calculate".equals(session.getUri())) {
            try {
                Map<String, String> body = new java.util.HashMap<>();
                session.parseBody(body);
                String jsonText = body.get("postData");

                JSONObject data = new JSONObject(jsonText);

                JSONArray contributions = data.getJSONArray("contributions");
                double purchasePrice = data.getDouble("purchasePrice");
                double salePrice = data.getDouble("salePrice");
                double commission = data.optDouble("commission", 0); // default = 0
                String shareType = data.getString("shareType"); // "contribution" or "percentage"

                // Net sale price after commission
                double netSale = salePrice - (salePrice * commission / 100);
                double totalProfit = netSale - purchasePrice;

                List<Double> shares = new ArrayList<>();

                if ("contribution".equalsIgnoreCase(shareType)) {
                    double totalContribution = 0;
                    for (int i = 0; i < contributions.length(); i++) {
                        totalContribution += contributions.getDouble(i);
                    }

                    for (int i = 0; i < contributions.length(); i++) {
                        double ratio = contributions.getDouble(i) / totalContribution;
                        shares.add(totalProfit * ratio);
                    }

                } else if ("percentage".equalsIgnoreCase(shareType)) {
                    for (int i = 0; i < contributions.length(); i++) {
                        double percent = contributions.getDouble(i);
                        shares.add(totalProfit * percent / 100);
                    }
                }

                // Build response JSON
                JSONObject response = new JSONObject();
                response.put("success", true);
                response.put("totalProfit", totalProfit);
                response.put("shares", shares);

                Response res = newFixedLengthResponse(Response.Status.OK, "application/json", response.toString());
                res.addHeader("Access-Control-Allow-Origin", "*");
                res.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                res.addHeader("Access-Control-Allow-Headers", "Content-Type");
                return res;

            } catch (Exception e) {
                e.printStackTrace();
                return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, "text/plain", "Error processing request.");
            }
        }

        // Default response for other paths
        Response res = newFixedLengthResponse("🟢 ShareWise Java server is running.");
        res.addHeader("Access-Control-Allow-Origin", "*");
        return res;
    }
}
