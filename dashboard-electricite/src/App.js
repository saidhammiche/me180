import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Box, Button, Divider } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FunctionsIcon from "@mui/icons-material/Functions";
import SpeedIcon from "@mui/icons-material/Speed";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TimelineIcon from "@mui/icons-material/Timeline";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VoltageSvgIcon from "@mui/icons-material/FlashOn";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/data");
      console.log("Données:", res.data);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value, decimals = 3, unit = "") => {
    if (value === undefined || value === null) return "0";
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    return `${num.toFixed(decimals)}${unit ? " " + unit : ""}`;
  };

  const primaryColor = "#7cbbcd";
  const grafanaUrl = "http://172.16.1.97:3000/d/adlddrl/monitoring-des-stromverbrauchs-e28093-me180e2809c?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s";

  const orderedChannels = [
    "CH1", "CH2", "CH3", "CH4", "CH5", "CH6",
    "CH7", "CH8", "CH9", "CH10", "CH11", "CH12",
    "CH13", "CH14", "CH15", "CH16", "CH17", "CH18"
  ];

  const group1 = orderedChannels.slice(0, 6);
  const group2 = orderedChannels.slice(6, 12);
  const group3 = orderedChannels.slice(12, 18);

  const spannungU1 = data["CH1"]?.Spannung;
  const spannungU2 = data["CH7"]?.Spannung;
  const spannungU3 = data["CH13"]?.Spannung;

  const ValueRow = ({ icon: Icon, label, value, unit }) => {
    const formattedValue = formatValue(value, label === "Cosinus Phi" ? 4 : label === "Strom" ? 3 : 2, unit);
    
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 6 }}>
        <Box display="flex" alignItems="center" gap={0.8}>
          <Icon style={{ color: "#888", fontSize: "0.85rem" }} />
          <Typography variant="caption" style={{ color: "#666" }}>
            {label}:
          </Typography>
        </Box>
        {/* Valeur avec taille fixe et fond gris */}
        <Box 
          style={{ 
            backgroundColor: "#e0e0e0",
            padding: "2px 8px",
            borderRadius: "4px",
            minWidth: "100px",
            textAlign: "center",
            display: "inline-block"
          }}
        >
          <Typography variant="caption" style={{ fontWeight: 500, color: "#222" }}>
            {formattedValue}
          </Typography>
        </Box>
      </Box>
    );
  };

  const ChannelCard = ({ channel }) => {
    const channelData = data[channel] || {};
    const label = channelData.Label || channel;

    return (
      <Paper elevation={1} style={{ padding: "10px", backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 }}>
        <Box display="flex" alignItems="center" gap={1} style={{ marginBottom: 8 }}>
          <DeviceHubIcon style={{ color: primaryColor, fontSize: "0.9rem" }} />
          <Typography variant="subtitle2" style={{ fontWeight: 600, color: primaryColor, fontSize: "0.85rem" }}>
            {channel}
          </Typography>
          <Typography variant="caption" style={{ color: "#999", flex: 1, textAlign: "right", fontSize: "0.7rem" }}>
            {label}
          </Typography>
        </Box>

        <Divider style={{ marginBottom: 8, backgroundColor: "#e0e0e0" }} />

        <ValueRow icon={ElectricBoltIcon} label="Strom" value={channelData.Strom} unit="A" />
        <ValueRow icon={FunctionsIcon} label="Cosinus Phi" value={channelData.CosinusPhi} unit="" />
        <ValueRow icon={SpeedIcon} label="Wirkleistung" value={channelData.Wirkleistung} unit="W" />
        <ValueRow icon={FlashOnIcon} label="Blindleistung" value={channelData.Blindleistung} unit="var" />
        <ValueRow icon={TimelineIcon} label="Scheinleistung" value={channelData.Scheinleistung} unit="VA" />
        <ValueRow icon={BatteryChargingFullIcon} label="Energie" value={channelData.Energie} unit="kWh" />
      </Paper>
    );
  };

  const GroupSection = ({ channels, title, icon: Icon }) => (
    <Paper elevation={2} style={{ flex: 1, padding: "12px", background: "#fff", borderRadius: 10 }}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} style={{ marginBottom: 12 }}>
        <Icon style={{ color: primaryColor, fontSize: "1.1rem" }} />
        <Typography variant="subtitle2" style={{ fontWeight: 600, color: primaryColor, letterSpacing: "0.5px" }}>
          {title}
        </Typography>
      </Box>
      {channels.map(ch => (
        <ChannelCard key={ch} channel={ch} />
      ))}
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
        <Typography variant="h5" color={primaryColor}>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <div style={{ padding: "15px 40px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        
        <Paper elevation={2} style={{ padding: "12px 20px", marginBottom: 20, borderRadius: 10, backgroundColor: "#fff" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1.5}>
              <DashboardIcon style={{ color: primaryColor, fontSize: "1.8rem" }} />
              <Typography variant="h5" style={{ fontWeight: 600, color: "#333" }}>
                Live Monitoring - ME180
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              href={grafanaUrl} 
              target="_blank" 
              startIcon={<TrendingUpIcon />}
              style={{ borderColor: primaryColor, color: primaryColor, textTransform: "none", borderRadius: 20, fontSize: "0.75rem", padding: "4px 16px" }}
            >
              Grafana Dashboard
            </Button>
          </Box>
        </Paper>

        <Box display="flex" gap={2} style={{ marginBottom: 25 }}>
          <Paper elevation={2} style={{ flex: 1, padding: "15px", backgroundColor: "#fff", borderRadius: 10, textAlign: "center" }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <VoltageSvgIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600, color: "#555" }}>Phase 1</Typography>
            </Box>
            <Typography variant="h3" style={{ fontWeight: 600, color: "#222", marginTop: 5 }}>
              {formatValue(spannungU1, 1, "V")}
            </Typography>
            <Typography variant="caption" style={{ color: "#999" }}>Spannung L1</Typography>
          </Paper>
          
          <Paper elevation={2} style={{ flex: 1, padding: "15px", backgroundColor: "#fff", borderRadius: 10, textAlign: "center" }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <VoltageSvgIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600, color: "#555" }}>Phase 2</Typography>
            </Box>
            <Typography variant="h3" style={{ fontWeight: 600, color: "#222", marginTop: 5 }}>
              {formatValue(spannungU2, 1, "V")}
            </Typography>
            <Typography variant="caption" style={{ color: "#999" }}>Spannung L2</Typography>
          </Paper>
          
          <Paper elevation={2} style={{ flex: 1, padding: "15px", backgroundColor: "#fff", borderRadius: 10, textAlign: "center" }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <VoltageSvgIcon style={{ color: primaryColor, fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" style={{ fontWeight: 600, color: "#555" }}>Phase 3</Typography>
            </Box>
            <Typography variant="h3" style={{ fontWeight: 600, color: "#222", marginTop: 5 }}>
              {formatValue(spannungU3, 1, "V")}
            </Typography>
            <Typography variant="caption" style={{ color: "#999" }}>Spannung L3</Typography>
          </Paper>
        </Box>

        <div style={{ display: "flex", gap: 15 }}>
          <GroupSection channels={group1} title="KANÄLE CH1 - CH6" icon={ViewModuleIcon} />
          <GroupSection channels={group2} title="KANÄLE CH7 - CH12" icon={ViewModuleIcon} />
          <GroupSection channels={group3} title="KANÄLE CH13 - CH18" icon={ViewModuleIcon} />
        </div>

      </div>
    </div>
  );
}

export default App;