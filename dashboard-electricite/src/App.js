import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Paper, Box, Button, Divider } from "@mui/material";
import BoltIcon from '@mui/icons-material/Bolt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PowerIcon from '@mui/icons-material/Power';
import SpeedIcon from '@mui/icons-material/Speed';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Les clés triées comme dans l'original
  const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));

  // Séparation en trois groupes
  const group1 = sortedKeys.slice(0, 6);
  const group2 = sortedKeys.slice(6, 12);
  const group3 = sortedKeys.slice(12, 18);

  // Les lettres dans l'ordre correct pour chaque groupe
  const letters1 = ["a", "b", "c", "d", "e", "f"];
  const letters2 = ["g", "h", "i", "j", "k", "l"];
  const letters3 = ["m", "n", "o", "p", "q", "r"];

  const primaryColor = "#7cbbcd";
  const valueColor = "#6a9fa0";
  const maxColor = "#2ecc71";
  const minColor = "#e74c3c";

  const grafanaUrl = "http://172.16.1.97:3000/d/adlddrl/monitoring-des-stromverbrauchs-e28093-me180e2809c?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s";

  const formatValue = (value) => {
    if (value === undefined || value === null) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return "—";
    return num.toFixed(3);
  };

  // Fonction pour trouver tous les max et min d'un groupe (gère les égalités)
  const getMaxMinAll = (group) => {
    if (!group || group.length === 0) return { max: [], min: [], maxValue: null, minValue: null };
    
    let maxValue = -Infinity;
    let minValue = Infinity;
    
    group.forEach(key => {
      const value = parseFloat(data[key]);
      if (!isNaN(value)) {
        if (value > maxValue) maxValue = value;
        if (value < minValue) minValue = value;
      }
    });
    
    const maxKeys = [];
    const minKeys = [];
    
    group.forEach(key => {
      const value = parseFloat(data[key]);
      if (!isNaN(value)) {
        if (value === maxValue) maxKeys.push(key);
        if (value === minValue) minKeys.push(key);
      }
    });
    
    return { max: maxKeys, min: minKeys, maxValue, minValue };
  };

  const maxMin1 = getMaxMinAll(group1);
  const maxMin2 = getMaxMinAll(group2);
  const maxMin3 = getMaxMinAll(group3);

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
        
        {/* Titre principal avec icône */}
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 20, borderBottom: `2px solid ${primaryColor}`, paddingBottom: 10 }}>
          <div style={{ width: 100 }}></div>
          <Box display="flex" alignItems="center" gap={2}>
            <DashboardIcon style={{ color: primaryColor, fontSize: "2.2rem" }} />
            <Typography variant="h4" style={{ 
              fontWeight: 700, 
              color: primaryColor,
              fontSize: "2rem",
              letterSpacing: "1px",
              textAlign: "center"
            }}>
              Live Daten
            </Typography>
          </Box>
          <Button
            variant="outlined"
            href={grafanaUrl}
            target="_blank"
            startIcon={<TrendingUpIcon />}
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
              <Box display="flex" alignItems="center" gap={1}>
                <FlashOnIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
                <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 1 (L1) - Eingang</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <ElectricalServicesIcon style={{ color: primaryColor, fontSize: "1rem" }} />
                <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 10 }}>
              <BoltIcon style={{ color: "#666", fontSize: "1rem" }} />
              <Typography variant="body2" style={{ fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U1</Typography>
            </Box>
            
            <div style={{ flex: 1 }}>
              {group1.map((key, index) => (
                <div key={key} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: 8, 
                  padding: "4px 8px", 
                  background: "#fafafa", 
                  borderRadius: 6
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <CircleIcon style={{ color: primaryColor, fontSize: "0.7rem" }} />
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters1[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 90, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>
                        {formatValue(data[key])} A
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Affichage Max et Min après les canaux */}
            <Divider style={{ margin: "12px 0 8px 0" }} />
            <Box style={{ marginTop: 8, padding: "8px", background: "#f5f5f5", borderRadius: 8 }}>
              <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 4 }}>
                <ArrowUpwardIcon style={{ color: maxColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Max ({formatValue(maxMin1.maxValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: maxColor }}>
                  {maxMin1.max.join(", ")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ArrowDownwardIcon style={{ color: minColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Min ({formatValue(maxMin1.minValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: minColor }}>
                  {maxMin1.min.join(", ")}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Phase 2 */}
          <Paper elevation={3} style={{ flex: 1, padding: "15px", background: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <FlashOnIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
                <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 2 (L2) - Eingang</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <ElectricalServicesIcon style={{ color: primaryColor, fontSize: "1rem" }} />
                <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 10 }}>
              <BoltIcon style={{ color: "#666", fontSize: "1rem" }} />
              <Typography variant="body2" style={{ fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U2</Typography>
            </Box>
            
            <div style={{ flex: 1 }}>
              {group2.map((key, index) => (
                <div key={key} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: 8, 
                  padding: "4px 8px", 
                  background: "#fafafa", 
                  borderRadius: 6
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <CircleIcon style={{ color: primaryColor, fontSize: "0.7rem" }} />
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters2[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 90, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>
                        {formatValue(data[key])} A
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Affichage Max et Min après les canaux */}
            <Divider style={{ margin: "12px 0 8px 0" }} />
            <Box style={{ marginTop: 8, padding: "8px", background: "#f5f5f5", borderRadius: 8 }}>
              <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 4 }}>
                <ArrowUpwardIcon style={{ color: maxColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Max ({formatValue(maxMin2.maxValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: maxColor }}>
                  {maxMin2.max.join(", ")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ArrowDownwardIcon style={{ color: minColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Min ({formatValue(maxMin2.minValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: minColor }}>
                  {maxMin2.min.join(", ")}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Phase 3 */}
          <Paper elevation={3} style={{ flex: 1, padding: "15px", background: "#fff", borderRadius: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 10 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <FlashOnIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
                <Typography variant="h6" style={{ fontWeight: "bold", color: primaryColor, fontSize: "1.1rem" }}>Phase 3 (L3) - Eingang</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <ElectricalServicesIcon style={{ color: primaryColor, fontSize: "1rem" }} />
                <Typography variant="subtitle1" style={{ fontWeight: "bold", color: primaryColor, fontSize: "0.9rem" }}>Stromwandler</Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 10 }}>
              <BoltIcon style={{ color: "#666", fontSize: "1rem" }} />
              <Typography variant="body2" style={{ fontWeight: "bold", color: "#666", fontSize: "0.9rem" }}>U3</Typography>
            </Box>
            
            <div style={{ flex: 1 }}>
              {group3.map((key, index) => (
                <div key={key} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: 8, 
                  padding: "4px 8px", 
                  background: "#fafafa", 
                  borderRadius: 6
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <CircleIcon style={{ color: primaryColor, fontSize: "0.7rem" }} />
                    <Typography style={{ fontWeight: "bold", fontSize: "0.9rem", color: primaryColor, minWidth: 25 }}>{letters3[index]}</Typography>
                    <Typography style={{ fontSize: "0.85rem", color: "#333" }}>{key}</Typography>
                  </div>
                  <Card style={{ backgroundColor: valueColor, minWidth: 90, borderRadius: 4 }}>
                    <CardContent style={{ padding: "2px 8px" }}>
                      <Typography variant="body2" align="center" style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#fff" }}>
                        {formatValue(data[key])} A
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Affichage Max et Min après les canaux */}
            <Divider style={{ margin: "12px 0 8px 0" }} />
            <Box style={{ marginTop: 8, padding: "8px", background: "#f5f5f5", borderRadius: 8 }}>
              <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 4 }}>
                <ArrowUpwardIcon style={{ color: maxColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Max ({formatValue(maxMin3.maxValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: maxColor }}>
                  {maxMin3.max.join(", ")}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ArrowDownwardIcon style={{ color: minColor, fontSize: "1rem" }} />
                <Typography variant="caption" style={{ fontWeight: "bold", color: "#666" }}>Min ({formatValue(maxMin3.minValue)} A) :</Typography>
                <Typography variant="body2" style={{ fontWeight: "bold", color: minColor }}>
                  {maxMin3.min.join(", ")}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </div>

        {/* Menu du bas avec icônes */}
        <Box display="flex" justifyContent="center" gap={2} style={{ marginTop: 15, padding: "10px 0", flexWrap: "wrap" }}>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <PowerIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Strom</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <ShowChartIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Cosinus Phi</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <SpeedIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Wirkleistung</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <TimelineIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Scheinleistung</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <FlashOnIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Blindleistung</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} style={{ background: "#fff", padding: "4px 12px", borderRadius: 15, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <BoltIcon style={{ color: "#555", fontSize: "0.8rem" }} />
            <Typography variant="body2" style={{ fontWeight: "bold", color: "#555" }}>Energie</Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default App;