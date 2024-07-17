import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, CardBody, CardTitle, Button, Container, Form, Label, Input, FormGroup, Alert } from "reactstrap";

const DetalleAutor = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [autor, setAutor] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    imagen: ''
  });
  const [error, setError] = useState(null);

  const fetchAutorDetail = async () => {
    try {
      const autorData = await getAutorDetail(guid);
      const imagenData = await getImagenDetail(guid);
      setAutor(prevState => ({
        ...prevState,
        nombre: autorData.nombre,
        apellido: autorData.apellido,
        fechaNacimiento: autorData.fechaNacimiento,
        imagen: imagenData.image
      }));
    } catch (error) {
      console.error('Error al obtener los detalles del autor', error);
      setError('Error al obtener los detalles del autor.');
    }
  };

  const getAutorDetail = async (guid) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/Autor/${guid}`);
      return response.data.request;
    } catch (error) {
      console.error('Error al obtener los detalles del autor', error);
      throw error;
    }
  };

  const getImagenDetail = async (guid) => {
    try {
      const response = await axios.get(`http://localhost:4321/api/AutorImage/${guid}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la imagen del autor', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAutorDetail();
  }, [guid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAutor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para manejar el envío del formulario
  };

  const handleBack = () => {
    navigate('/starter');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // Obtiene el día del mes sin ceros a la izquierda
    const month = date.getMonth() + 1; // Los meses en JavaScript son de 0 a 11, por lo que sumamos 1
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  return (
    <Container>
      <Card>
        <CardBody>
          <CardTitle tag='h5'>Detalle del Autor</CardTitle>
          <br />
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md='5'>
                <FormGroup>
                  <Label>Nombre(s)</Label>
                  <Input
                    type="text"
                    name="nombre"
                    value={autor.nombre}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>

              <Col md='5'>
                <FormGroup>
                  <Label>Apellidos</Label>
                  <Input
                    type="text"
                    name="apellido"
                    value={autor.apellido}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md='5'>
                <FormGroup>
                  <Label>Fecha de nacimiento</Label>
                  <Input
                    type="text"
                    name="fechaNacimiento"
                    value={formatDate(autor.fechaNacimiento)}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md='1'></Col>
              <Col>
                {autor.imagen && (
                  <img
                    src={`data:image/jpeg;base64,${autor.imagen}`}
                    className="rounded-circle"
                    alt="avatar"
                    width="250"
                    height="250"
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col md='10'></Col>
              <Col>
                <Button type='button' color="primary" onClick={handleBack}>
                  Regresar
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default DetalleAutor;
