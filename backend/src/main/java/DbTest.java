import java.sql.*;

public class DbTest {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://db.vejapunmvtuixzhgtifg.supabase.co:5432/postgres";
        String user = "postgres";
        String password = "Abcd@.159147";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("✅ Connected successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
