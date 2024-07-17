import {Table, Row, Col, Card, CardBody, CardTitle, CardSubtitle, Button, Container, Alert, Spinner  } from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from "../../layouts/loader/Loader";

const CuponesTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Función para redirigir a la página AgregarAutor
    const handleButtonClick = () => {
        navigate('/agregarCupon');
    };

    // Función para redirigir a la página de detalles del autor
    const handleDetailClick = (id) => {
        navigate(`/detalleCupon/${id}`);
    };

    const handleDeleteClick = async (id) => {
        try{
            setIsLoading(true);
            const response = await axios.delete(`http://localhost:7170/api/Cupon/id:int?id=${id}`)
            await fetchCupones();
            console.log(response)
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    // Función para obtener los datos de los autores
    const fetchCupones = async () => {
        try {
            const response = await axios.get('http://localhost:7170/api/Cupon');
            setData(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los cupones', error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCupones();
    }, []);

    if (loading) {
        return <Loader />;
    } else if (error) {
        return <Alert color="danger">Ha ocurrido un problema, porfavor intente mas tarde</Alert>;
    } else {
        ;
        return (
            <div>
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardBody>
                                <Container>
                                    <Row>
                                        <Col md='10'>
                                            <CardTitle tag="h5">Cupones</CardTitle>
                                            <CardSubtitle className="mb-2 text-muted" tag="h6">
                                                Consultar y/o editar
                                            </CardSubtitle>
                                        </Col>
                                        <Col>
                                            <Button color="success" onClick={handleButtonClick}>Agregar Cupon</Button>
                                        </Col>
                                    </Row>
                                </Container>

                                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                                    <thead>
                                        <tr>
                                            <th>Codigo de cupon</th>
                                            <th>Porcentaje descuento </th>
                                            <th>Descuento minimo</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((tdata, index) => (
                                            <tr key={index} className="border-top">
                                                <td>{tdata.cuponCode}</td>
                                                <td>{tdata.porcentajeDescuento}</td>
                                                <td>{tdata.descuentoMinimo}</td>
                                                <td>
                                                    <Button className="btn" color="primary" onClick={() => handleDetailClick(tdata.cuponId)}>Editar</Button>
                                                </td>
                                                <td>
                                                <Button type="submit" color="danger" disabled={isLoading} onClick={() => handleDeleteClick(tdata.cuponId)}>
                                            {isLoading ? <Spinner size="sm" /> : 'Eliminar'}
                                        </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

export default CuponesTable;