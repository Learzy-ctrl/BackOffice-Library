import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button, Container, Form, Label, Input, FormGroup, Alert, Spinner } from "reactstrap";
import Libro from '../assets/images/Cupones.png';
import axios from 'axios';

const DetalleCupon = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        cuponCode: '',
        fecha: '',
        porcentajeDescuento: '',
        descuentoMinimo: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlertMessage('');

        const formattedData = {
            cuponId: id,
            cuponCode: `${formData.cuponCode}-${formData.fecha}-${formData.porcentajeDescuento}`,
            porcentajeDescuento: parseFloat(formData.porcentajeDescuento),
            descuentoMinimo: parseInt(formData.descuentoMinimo, 10),
        };

        try {
            console.log(formattedData);
            await axios.put('http://localhost:7170/api/Cupon', formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAlertMessage('Cupón modificado correctamente');
            setAlertType('success');
        } catch (error) {
            setAlertMessage(`Error al enviar el formulario: ${error.response?.data || error.message}`);
            setAlertType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    const getCuponDetail = async (id) => {
        try {
            const response = await axios.get(`http://localhost:7170/api/Cupon/id:int?id=${id}`);
            const result = response.data.result;
            const [prefix, year, month, day, discount] = result.cuponCode.split('-');
            setFormData({
                cuponCode: prefix,
                fecha: `${year}-${month}-${day}`,
                porcentajeDescuento: discount,
                descuentoMinimo: result.descuentoMinimo,
            });
        } catch (error) {
            console.error('Error al obtener los detalles del cupon', error);
            throw error;
        }
    };

    useEffect(() => {
        getCuponDetail(id);
    }, [id]);

    return (
        <Container>
            <Row>
                <Col md="8">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Editar Cupon</CardTitle>
                            <CardSubtitle className="mb-2 text-muted" tag="h6">Ingresa datos para editar cupon</CardSubtitle>
                            <br />
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="9">
                                        <FormGroup>
                                            <Label>Prefijo</Label>
                                            <Input type="text" placeholder="BLACKFRIDAY" value={formData.cuponCode} name='cuponCode' onChange={handleChange} required />
                                        </FormGroup>
                                        <br />
                                        <FormGroup>
                                            <Label>Fecha</Label>
                                            <Input type="date" value={formData.fecha} name='fecha' onChange={handleChange} required />
                                        </FormGroup>
                                        <br />
                                        <Row>
                                            <Col>
                                                <FormGroup>
                                                    <Label>Porcentaje descuento</Label>
                                                    <Input type="text" placeholder="25" value={formData.porcentajeDescuento} name='porcentajeDescuento' onChange={handleChange} required />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Label>Descuento minimo</Label>
                                                    <Input type="text" placeholder="5" value={formData.descuentoMinimo} name='descuentoMinimo' onChange={handleChange} required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" color="success" disabled={isLoading}>
                                            {isLoading ? <Spinner size="sm" /> : 'Modificar Cupon'}
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card>
                        <CardBody>
                            <Row>
                                <img src={Libro} alt="book" width="250" height="250" />
                            </Row>
                            <br />
                            <Row>
                                <Label style={{ fontWeight: 'bold' }}>Codigo Cupon</Label>
                                <h6>{`${formData.cuponCode}-${formData.fecha}-${formData.porcentajeDescuento}`}</h6>
                            </Row>
                        </CardBody>
                    </Card>
                    {alertMessage && (
                        <Alert color={alertType} className="mt-3">
                            {alertMessage}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleCupon;
