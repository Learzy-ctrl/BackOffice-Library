import React, { useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Button, Container, Form, Label, Input, FormGroup, Alert, Spinner } from "reactstrap";
import axios from 'axios';

const AgregarAutor = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMessage('');

    const formattedData = {
      ...formData,
      fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/Autor', formattedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const guid = response.data.request;

      if (image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const byteArray = new Uint8Array(reader.result);
          const base64String = btoa(String.fromCharCode(...byteArray));

          try {
            await axios.post('http://localhost:4321/api/AutorImage', {
              guid,
              image: base64String,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            setAlertMessage('Autor registrado correctamente');
            setAlertType('success');
          } catch (imageError) {
            setAlertMessage(`Error al enviar la imagen: ${imageError.response?.data || imageError.message}`);
            setAlertType('danger');
          }
        };
        reader.readAsArrayBuffer(image);
      } else {
        setAlertMessage('Autor registrado sin imagen');
        setAlertType('success');
      }
    } catch (error) {
      setAlertMessage(`Error al enviar el formulario: ${error.response?.data || error.message}`);
      setAlertType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag='h5'>Agregar nuevo autor</CardTitle>
          <br />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md='5'>
                <FormGroup>
                  <Label>Nombre(s)</Label>
                  <Input type="text" placeholder="Example" value={formData.nombre} onChange={handleChange} name='nombre' />
                </FormGroup>
              </Col>

              <Col md='5'>
                <FormGroup>
                  <Label>Apellidos</Label>
                  <Input type="text" placeholder="Example" value={formData.apellido} onChange={handleChange} name='apellido' />
                </FormGroup>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md='5'>
                <FormGroup>
                  <Label>Fecha de nacimiento</Label>
                  <Input type="date" value={formData.fechaNacimiento} onChange={handleChange} name='fechaNacimiento' />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>Imagen</Label>
                  <Input type="file" onChange={handleImageChange} />
                </FormGroup>
              </Col>
              <Col md='1'></Col>
              <Col>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="rounded-circle"
                    alt="avatar"
                    width="250"
                    height="250"
                  />
                ) : (
                  <div></div>
                )}
              </Col>
            </Row>
            <Row>
              <Col md='10'></Col>
              <Col>
                <Button type='submit' color="success" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : 'Crear Autor'}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      {alertMessage && (
        <Alert color={alertType} className="mt-3">
          {alertMessage}
        </Alert>
      )}
    </Container>
  );
};

export default AgregarAutor;
