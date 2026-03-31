import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Paper, Box, Button } from "@mui/material";

function App() {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/data");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Les clés triées comme dans l'original
  const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));

  // Séparation en trois groupes
  const group1 = sortedKeys.slice(0, 6);
  const group2 = sortedKeys.slice(6, 12);
  const group3 = sortedKeys.slice(12, 18);

  const letters1 = ["a", "b", "c", "d", "e", "f"];
  const letters2 = ["g", "h", "i", "j", "k", "l"];
  const letters3 = ["m", "n", "o", "p", "q", "r"];

  const primaryColor = "#7cbbcd";
  const valueColor = "#6a9fa0";

  const grafanaUrl = "http://172.16.1.97:3000/d/adlddrl/monitoring-des-stromverbrauchs-e28093-me180e2809c?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s";

  return (
    <div style={{ 
      padding: 20, 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#e0e0e0",
      overflow: "hidden"
    }}>
      <div style={{ maxWidth: 1300, width: "100%", height: "calc(100vh - 40px)", display: "flex", flexDirection: "column" }}>
        
        {/* Titre Live Daten avec bouton Live Trend professionnel */}
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 20, borderBottom: `2px solid ${primaryColor}`, paddingBottom: 10 }}>
          <div style={{ width: 100 }}></div>
          <Typography variant="h4" style={{ 
            fontWeight: 700, 
            color: primaryColor,
            fontSize: "2rem",
            letterSpacing: "1px",
            textAlign: "center"
          }}>
            Live Daten
          </Typography>
          <Button
            variant="outlined"
            href={grafanaUrl}
            target="_blank"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              padding: "6px 20px",
              borderRadius: 30,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              letterSpacing: "0.5px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = primaryColor;
              e.target.style.color = "white";
              e.target.style.borderColor = primaryColor;
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = primaryColor;
              e.target.style.borderColor = primaryColor;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            Live Trend
          </Button>
        </Box>

        <div style={{ flex: 1, display: "flex", gap: 20, minHeight: 0 }}>
          {/* Phase 1 */}
          <Paper elevation={3} style={{ flex: 1, padding: "15px", background: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
              <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 1 (L1) - Eingang</Typography>
              <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
            </Box>
            <Typography variant="body2" style={{ marginBottom: 10, fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U1</Typography>
            <div style={{ flex: 1 }}>
              {group1.map((key, index) => (
                <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8, padding: "4px 8px", background: "#fafafa", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters1[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 70, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>{data[key]} A</Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Paper>

          {/* Phase 2 */}
          <Paper elevation={3} style={{ flex: 1, padding: "15px", background: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
              <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 2 (L2) - Eingang</Typography>
              <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
            </Box>
            <Typography variant="body2" style={{ marginBottom: 10, fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U2</Typography>
            <div style={{ flex: 1 }}>
              {group2.map((key, index) => (
                <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8, padding: "4px 8px", background: "#fafafa", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters2[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 70, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>{data[key]} A</Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Paper>

          {/* Phase 3 */}
          <Paper elevation={3} style={{ flex: 1, padding: "15px", background: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
              <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 3 (L3) - Eingang</Typography>
              <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
            </Box>
            <Typography variant="body2" style={{ marginBottom: 10, fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U3</Typography>
            <div style={{ flex: 1 }}>
              {group3.map((key, index) => (
                <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8, padding: "4px 8px", background: "#fafafa", borderRadius: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters3[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 70, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>{data[key]} A</Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Paper>
        </div>

        <Box display="flex" justifyContent="center" gap={2} style={{ marginTop: 15, padding: "10px 0", flexWrap: "wrap" }}>
          {["Strom", "Cosinus Phi", "Wirkleistung", "Scheinleistung", "Blindleistung", "Energie"].map((item) => (
            <Typography key={item} variant="body2" style={{ fontWeight: "bold", color: "#555", background: "#fff", padding: "4px 12px", borderRadius: 15, fontSize: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              {item}
            </Typography>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default App;