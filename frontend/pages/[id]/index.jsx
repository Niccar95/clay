import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import Link from 'next/link';
import moment from 'moment';
import PropTypes from 'prop-types';
import RequiresRole from 'flaivy-react/components/RequiresRole';
import DetailsComponent from '../../../../components/generated/{{pascalCase name}}DetailsComponent';
import EventsourceList from '../../../../components/EventsourceListComponent';
import { get } from '../../../../shared/actions/generated/{{kebabCase name}}.actions';
// import {
//   ActivateModalForm,
//   DeactivateModalForm,
// } from '../../../../components/action-forms/{{kebabCase name}}';

const ButtonBar = ({ entity }) => (
  <>
    <Link href={`/app/{{kebabCase (pluralize name)}}/${entity.id}/edit`} passHref>
      <Button color="secondary" className="float-end">
        Redigera
      </Button>
    </Link>
{/*
    <ActivateModalForm entity={entity} />
    <DeactivateModalForm entity={entity} /> */}
  </>
);
ButtonBar.propTypes = {
  entity: PropTypes.object.isRequired,
};

function {{pascalCase name}}Details({ entity }) {
  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col md="12">
              <Row>
                <Col md="12">
                  <h3 className="mt-0">{entity.name} </h3>
                  <p className="mb-3">
                    Skapades{' '}
                    {moment(entity.createdAt).format('YYYY-MM-DD HH:mm')}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <DetailsComponent entity={entity} />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <ButtonBar entity={entity} />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <RequiresRole requiredRoles={["super"]}>
        <Card>
          <CardBody>
            <h4>Journal</h4>
            <EventsourceList
              serviceNames={['oms']}
              query={ { entityId: entity.id } }
            />
          </CardBody>
        </Card>
      </RequiresRole>
    </>
  );
}
{{pascalCase name}}Details.propTypes = {
  entity: PropTypes.object.isRequired,
}

{{pascalCase name}}Details.getInitialProps = async({ reduxStore, query, req }) => {
  const response = await reduxStore.dispatch(get(req, query.id));
  const entity = response.value.data;
  return { query, reduxStore, entity };
}

const mapStateToProps = ({ {{camelCase name}}DetailsPage }) => ({
  entity: {{camelCase name}}DetailsPage.entity,
});

const mapDispatchToProps = { get };
export default connect(mapStateToProps, mapDispatchToProps)({{pascalCase name}}Details);