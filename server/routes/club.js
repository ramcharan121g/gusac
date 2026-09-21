import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/council', (req, res) => {
  res.json({ council: db.council });
});

router.get('/trophies', (req, res) => {
  res.json({ trophies: db.trophies });
});

router.get('/pulse', (req, res) => {
  res.json({
    activeMakers: 42,
    labOpenStatus: 'OPEN 24/7 (Access Badge Active)',
    recentActivities: [
      { id: '1', user: 'Sneha Reddy', action: 'Flight-tested Garuda-X VTOL at Tech Grounds', time: '12 mins ago', wing: 'Aeromodelling' },
      { id: '2', user: 'Aarav Sharma', action: 'Calibrated RPLiDAR A2 on Astra Rover chassis', time: '28 mins ago', wing: 'Robotics' },
      { id: '3', user: 'Vikram Nair', action: 'Deployed OWASP ASVS verification gateway v2.0', time: '45 mins ago', wing: 'CyberSec' },
      { id: '4', user: 'P. Rohit', action: 'PCB pick-and-place assembled for LoRa Mesh node', time: '1 hr ago', wing: 'IoT' },
      { id: '5', user: 'T. Ananya', action: 'Captured Jupiter Great Red Spot transit from Observatory', time: '3 hrs ago', wing: 'Astronomy' }
    ]
  });
});

export default router;
