import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button, Container, Form, Label, Input, FormGroup, Alert, Spinner } from "reactstrap";
import Libro from '../assets/images/Libro.png';
import axios from 'axios';

const AgregarLibro = () => {
    const [autores, setData] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        fechaPublicacion: '',
        autorLibro: '',
    });
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

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/Autor');
            setData(response.data.request);
        } catch (error) {
            console.error('Error al obtener los datos de los autores', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlertMessage('');

        const formattedData = {
            ...formData,
            fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
        };
        try {
            console.log(formattedData)
            const response = await axios.post('http://localhost:1234/api/Libro', formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAlertMessage('Libro registrado correctamente');
            setAlertType('success');
        } catch (error) {
            setAlertMessage(`Error al enviar el formulario: ${error.response?.data || error.message}`);
            setAlertType('danger');
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        fetchAuthors();
    }, []);

    // Encuentra el autor seleccionado en base a autorLibroGuid
    const autorSeleccionado = autores.find(autor => autor.autorLibroGuid === formData.autorLibro);

    return (
        <Container>
            <Row>
                <Col md="8">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Agregar nuevo Libro</CardTitle>
                            <CardSubtitle className="mb-2 text-muted" tag="h6">con su respectivo autor</CardSubtitle>
                            <br />
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="9">
                                        <FormGroup>
                                            <Label>Titulo del libro</Label>
                                            <Input type="text" placeholder="Example" value={formData.titulo} name='titulo' onChange={handleChange} required />
                                        </FormGroup>
                                        <br />
                                        <FormGroup>
                                            <Label>Fecha de publicacion</Label>
                                            <Input type="date" value={formData.fechaPublicacion} name='fechaPublicacion' onChange={handleChange} required />
                                        </FormGroup>
                                        <br />
                                        <Row>
                                        <Col md='6'>
                                        <FormGroup>
                                            <Label>Autor</Label>
                                            <Input type="select" value={formData.autorLibro} name='autorLibro' onChange={handleChange} required>
                                                <option value="">Selecciona un autor</option>
                                                {autores.map(autor => (
                                                    <option key={autor.autorLibroGuid} value={autor.autorLibroGuid}>
                                                        {`${autor.nombre} ${autor.apellido}`}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        </Col>
                                        <Col md='6'>
                                        <FormGroup>
                                            <Label>Agregar Cupon (opcional)</Label>
                                            <Input type="select" value={formData.autorLibro} name='autorLibro' onChange={handleChange} required>
                                                <option value="">Selecciona un cupon</option>
                                                {autores.map(autor => (
                                                    <option key={autor.autorLibroGuid} value={autor.autorLibroGuid}>
                                                        {`${autor.nombre} ${autor.apellido}`}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                        </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" color="success" disabled={isLoading}>
                                            {isLoading ? <Spinner size="sm" /> : 'Registrar libro'}
                                        </Button>
                                    </div>
                                </Row>

                            </Form>
                        </CardBody>
                    </Card>
                    {alertMessage && (
                        <Alert color={alertType} className="mt-3">
                            {alertMessage}
                        </Alert>
                    )}
                </Col>
                <Col md="4">
                    <Card>
                        <CardBody>
                            <Row>
                                <img src={Libro} alt="book" width="250" height="250" />
                            </Row>
                            <br />
                            <Row>
                                <Label style={{ fontWeight: 'bold' }}>Titulo del libro</Label>
                                <h6>{formData.titulo}</h6>
                            </Row>
                            <br />
                            <Row>
                                <Label style={{ fontWeight: 'bold' }}>Fecha de publicacion</Label>
                                <h6>{formData.fechaPublicacion}</h6>
                            </Row>
                            <br />
                            <Row>
                                <Label style={{ fontWeight: 'bold' }}>Autor</Label>
                                <h6>{autorSeleccionado ? `${autorSeleccionado.nombre} ${autorSeleccionado.apellido}` : ''}</h6>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AgregarLibro;
