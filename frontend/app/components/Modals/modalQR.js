"use client";

import React, { useState, useEffect } from "react";
import qrCodeService from "@/services/qrService";
import { BsQrCode } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

const ModalQR = ({ isOpen, onClose }) => {
  const [timer, setTimer] = useState(900);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [, setSessionId] = useState(null); // Mover los estados aquí
  const [, setQrUrl] = useState(null); // Mover los estados aquí
  const router = useRouter();

  const apprenticeEmail = "caceresgabriel305@gmail.com";

  useEffect(() => {
    if (!isOpen) return;

    const fetchQRCode = async () => {
      try {
        const { qrCodeImage, sessionId, qrUrl } = await qrCodeService.generateQRCode();

        setQrCodeImage(qrCodeImage);
        setSessionId(sessionId);
        setQrUrl(qrUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchQRCode();
    setShowModal(true);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/AprendicesList");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, router]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
      setTimer(900);
      setQrCodeImage(null);
    }, 300);
  };

  const sendAttendanceEmail = async () => {
    if (!qrCodeImage) {
      alert("No hay imagen QR generado.");
      return;
    }

    // Limpias el base64 para el attachment
    const base64Qr = qrCodeImage.replace(/^data:image\/png;base64,/, "");

    const emailData = {
      email: apprenticeEmail,
      subject: "Notificación de Asistencia",
      htmlContent: `
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Formulario Redirección Email</title>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #00314D;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              padding: 10px 30px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              color: #4b5563;
            }
            .steps {
              list-style-type: decimal;
              padding-left: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #4b5563;
            }
            .button-link {
              background-color: #00314D;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logoImage" alt="Logo del SENA" style="width: 50px; height: 50px;" />
              <h2 style="color: #1fd137; margin: 0;">QR Formulario De Asistencia</h2>
            </div>
            <div class="content">
              <p>Hola, [nombre del aprendiz]:</p>
              <p>Parece que vas a confirmar tu asistencia nuevamente.<br>Para hacerlo, hemos generado un código QR único que te permitirá verificar tu asistencia en nuestra plataforma.</p>
              <p><strong>Sigue estos pasos para completar el proceso:</strong></p>
              <ol class="steps">
                <li><strong>Si estás en tu computadora:</strong> usa la cámara de tu teléfono para escanear el código QR adjunto.</li>
                <li>
                  <img src="cid:newQrImage123" style="background: #ff5733; display: block; margin: 0 auto; width: 100px; height: 100px;" />
                </li>
                <li><strong>Si has recibido un enlace:</strong> haz clic en el siguiente enlace para confirmar tu asistencia.</li>
              </ol>
              <div style="text-align: center;">
                <a href="https://6c12-179-1-218-161.ngrok-free.app/FormularioQRAsistencia?session=b66e37b5-2c11-40a4-bc3d-ab398eb0cab3"
                  class="button-link">Enlace incluido</a>
              </div>
              <p>Si no solicitaste este código o no estás confirmando tu asistencia, por favor responde a este mensaje o contáctanos directamente. Estaremos encantados de ayudarte.</p>
            </div>
            <div class="footer">
              <p>Atentamente,<br>SENA Equipo de Asistencia</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: "qr.png",
          content: base64Qr,
          encoding: "base64",
          cid: "newQrImage123",
        }
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/send-notification",
        emailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data.message);
      toast.success("Correo enviado con éxito!");
    } catch (error) {
      console.error("Error al enviar correo:", error);
      toast.error("Error al enviar el correo.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none transition-opacity duration-300 ease-in-out ${showModal ? "opacity-100" : "opacity-0"
        }`}
    >
      <div
        className="fixed inset-0 flex items-center bg-black bg-opacity-25"
        onClick={handleClickOutside}
      ></div>
      <div
        className={`relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${showModal ? "scale-100" : "scale-90"
          }`}
      >
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-center items-center">
            <h1 className="text-center font-semibold font-inter text-xl sm:text-2xl md:text-3xl">
              Código QR Para la Toma de Asistencia
            </h1>
          </div>
          <br />
          <div className="flex justify-center">
            <div className="w-56 h-56 sm:w-72 sm:h-72">
              {qrCodeImage ? (
                <Image
                  src={qrCodeImage}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BsQrCode className="w-full h-full text-gray-500" />
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <span className="text-xl sm:text-2xl font-medium font-inter">
              Duración del QR
            </span>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-xl sm:text-2xl font-medium font-inter">{formatTime(timer)}</span>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleClose}
            >
              Cerrar
            </button>
            <button
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={sendAttendanceEmail}
            >
              Enviar Correo
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ModalQR;
