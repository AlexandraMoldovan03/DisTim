import { useState } from "react";
import { Button } from "../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const handleDeleteData = async (id: string) => {
    setLoading(true);
    setMessage("");

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:8080/api/admin/content/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Data deleted successfully!");
      } else {
        setMessage("Failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <Button
        disabled={loading}
        onClick={() => handleDeleteData("REPLACE_WITH_ID")}
      >
        {loading ? "Deleting..." : "Delete Test Record"}
      </Button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default AdminPage;
