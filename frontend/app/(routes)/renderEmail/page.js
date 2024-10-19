"use client"
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AbsenceEmailNotification from "../../components/absenceEmailNotification";

export default function handler(req, res) {
  const { studentName, date } = req.query;

  try {
    const emailHtml = ReactDOMServer.renderToString(
      <AbsenceEmailNotification studentName={studentName} date={date} />
    );
    res.status(200).send(emailHtml);
  } catch (error) {
    res.status(500).send('Error al renderizar el email');
  }
}