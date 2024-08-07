import { Card, CardBody, CardTitle, CardSubtitle, Table, Button, Col, Row, Container, Alert } from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from "../../layouts/loader/Loader";

const ProjectTables = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Función para redirigir a la página AgregarAutor
  const handleButtonClick = () => {
    navigate('/agregarAutor');
  };

  // Función para redirigir a la página de detalles del autor
  const handleDetailClick = (guid) => {
    navigate(`/detalleAutor/${guid}`);
  };

  // Función para obtener los datos de los autores
  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/Autor');
      console.log(response.data.request);
      return response.data.request;
    } catch (error) {
      console.error('Error al obtener los datos de los autores', error);
      setError(error);
      return [];
    }
  };

  // Función para obtener las imágenes de los autores
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:4321/api/AutorImage');
      return response.data.request;
    } catch (error) {
      console.error('Error al obtener las imágenes', error);
      return [];
    }
  };

  // Combinar datos de autores con sus imágenes correspondientes
  const combineData = (authors, images) => {
    return authors.map(author => {
      const image = images.find(img => img.guid === author.autorLibroGuid);
      return {
        ...author,
        avatar: image ? image.image : '' // Cambia a 'avatar' para que coincida con el componente
      };
    });
  };

  // Obtener los datos de ambas APIs y combinarlos
  const fetchData = async () => {
    try {
      const [authors, images] = await Promise.all([fetchAuthors(), fetchImages()]);
      const combinedData = combineData(authors, images);
      setData(combinedData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  } else if (error) {
    return <Alert color="danger">Ha ocurrido un problema, porfavor intente mas tarde</Alert>;
  } else {;
    return (
      <div>
        <Card>
          <CardBody>
            <Container>
              <Row>
                <Col md='10'>
                  <CardTitle tag="h5">Lista de autores</CardTitle>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Consultar y/o editar
                  </CardSubtitle>
                </Col>
                <Col>
                  <Button color="primary" onClick={handleButtonClick}>Agregar Autor</Button>
                </Col>
              </Row>
            </Container>

            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha de nacimiento</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tdata, index) => (
                  <tr key={index} className="border-top">
                    <td>
                      <div className="d-flex align-items-center p-2">
                        <img
                          src={"data:image/jpeg;base64," + tdata.avatar}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0">{tdata.nombre}</h6>
                        </div>
                      </div>
                    </td>
                    <td>{tdata.apellido}</td>
                    <td>{new Date(tdata.fechaNacimiento).toLocaleDateString()}</td>
                    <td>
                      <Button className="btn" color="success" onClick={() => handleDetailClick(tdata.autorLibroGuid)}>Detalle</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
};

export default ProjectTables;
