const express = require("express");
const cors = require("cors");
const { InfluxDB } = require("@influxdata/influxdb-client");

const app = express();
app.use(cors());

// 🔐 CONFIG INFLUXDB
const url = "http://172.16.1.97:8086"; // adapte si besoin
const token = "NPpro-jVnJM8zUCPIGhHUrRF08lhZ47XsVPaRO2SwPIjFvsrAJpQGRB71DoGinnvD_yqXW8mTtFqeZ72vWcIzA=="; // garde secret
const org = "home";
const bucket = "mE180letzte";

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// 📡 API pour React
app.get("/data", async (req, res) => {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "me180")
      |> filter(fn: (r) => r.Device == "mE180")
      |> filter(fn: (r) => r._field == "Strom")
      |> filter(fn: (r) => r.Kanal =~ /^CH[1-9]$|^CH1[0-8]$/)
      |> last()
  `;

  try {
    const rows = await queryApi.collectRows(fluxQuery);
    console.log("Rows:", rows); // ✅ voir ce que renvoie InfluxDB

    let result = {};
    rows.forEach(row => {
      result[row.Kanal] = row._value;
    });

    res.json(result);

  } catch (error) {
    console.error("ERREUR BACKEND:", error); // 🔴 affiche l’erreur complète
    res.status(500).send("Erreur serveur : " + error.message);
  }
});

// 🚀 Lancer le serveur
app.listen(4000, () => {
  console.log("Serveur lancé sur http://localhost:4000");
});