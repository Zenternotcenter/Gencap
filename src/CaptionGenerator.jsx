import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { BsClipboard, BsStars, BsMoon, BsSun } from 'react-icons/bs';

export default function CaptionGenerator() {
  const [input, setInput] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('th');
  const [languages, setLanguages] = useState({});
  const [randomTopics, setRandomTopics] = useState([]);

  // โหลดหัวข้อแบบสุ่มและภาษา
  useEffect(() => {
    fetch('https://backend-tmb5.onrender.com')
      .then(response => response.json())
      .then(data => setRandomTopics(data.topics))
      .catch(error => console.error("เกิดข้อผิดพลาดในการโหลดหัวข้อ:", error));

    fetch('https://backend-tmb5.onrender.com')
      .then(response => response.json())
      .then(data => setLanguages(data.languages))
      .catch(error => console.error("เกิดข้อผิดพลาดในการโหลดภาษา:", error));
  }, []);

  const generateCaption = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setCaption('');

    try {
      const response = await fetch('https://backend-tmb5.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, language }),
      });
      const data = await response.json();
      setCaption(data.caption || 'เกิดข้อผิดพลาด');
    } catch (error) {
      console.error('Error:', error);
      setCaption('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`d-flex align-items-center justify-content-center ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh' }}>
      <Container className="p-5" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <Button variant={darkMode ? 'light' : 'dark'} onClick={() => setDarkMode(!darkMode)} className="rounded-circle p-3">
            {darkMode ? <BsSun size={30} /> : <BsMoon size={30} />}
          </Button>
          <h1 className="fw-bold mt-3"><BsStars /> สร้างแคปชั่นด้วย AI</h1>
          <p className="text-muted">สร้างแคปชั่นเท่ ๆ แบบอัตโนมัติ พร้อมสุ่มหัวข้อและเลือกภาษาได้!</p>
        </div>

        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="พิมพ์ข้อความที่ต้องการให้ AI สร้างแคปชั่น..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-3 fs-5"
          />
        </Form.Group>

        <Row className="mb-4">
          <Col>
            <Form.Select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-3 fs-5">
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <div className="text-center mb-4">
          <Button variant="secondary" className="me-3 px-4 py-3 fs-5" onClick={() => setInput(randomTopics[Math.floor(Math.random() * randomTopics.length)])}>
            🎲 สุ่มหัวข้อ
          </Button>
          <Button variant="primary" className="px-4 py-3 fs-5" onClick={generateCaption} disabled={loading}>
            {loading ? 'กำลังสร้าง...' : 'สร้างแคปชั่น'}
          </Button>
        </div>

        {caption && (
          <Card className="shadow-lg p-4 animate__animated animate__fadeIn">
            <Card.Body className="text-center">
              <Card.Text className="fs-4 fw-bold">🎉 "{caption}"</Card.Text>
              <Button variant="outline-success" className="px-4 py-3 fs-5" onClick={copyToClipboard}>
                <BsClipboard /> {copied ? "คัดลอกแล้ว!" : "คัดลอกแคปชั่น"}
              </Button>
            </Card.Body>
          </Card>
        )}

        {copied && (
          <Alert variant="success" className="mt-3 text-center animate__animated animate__bounce">
            ✅ คัดลอกแคปชั่นเรียบร้อยแล้ว!
          </Alert>
        )}
      </Container>
    </div>
  );
}
