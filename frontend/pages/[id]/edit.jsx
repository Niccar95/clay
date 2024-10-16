import { Card, CardBody, Col, Row } from 'reactstrap';
import datalayer from 'app/datalayer';
import domainModel from 'domain-model';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import _ from 'lodash';
import EntityHeader from 'components/page/EntityHeader';
import getAxiosInstance from 'app/config/api';
import { UpsertForm } from 'components/action-forms/{{kebabCase name}}/UpsertForm';

_.mixin(require('lodash-uuid'));

function {{pascalCase name}}Edit({ entity }) {
  const router = useRouter();

  const onSave = () => {
    router.push(
      {
        pathname: `/app/{{kebabCase (pluralize name)}}/${entity.id}`,
      })
  };
  return (
    <>
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <Row>
                <Col md="12">
                  <EntityHeader entity={entity} className="mb-3" />
                  <UpsertForm entity={entity} onSubmit={onSave} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
{{pascalCase name}}Edit.propTypes = {
  entity: PropTypes.object.isRequired,
};

{{pascalCase name}}Edit.getInitialProps = async ({ query, req }) => {
  let entity = domainModel.{{camelCase name}}.ensureInvariants({ id: _.uuid() });
  if (query.id && query.id !== 'new') {
    const viewModel = await datalayer.{{camelCase name}}.get(query, req);
    entity = viewModel;
  }
  if (query.copy{{pascalCase name}}) {
    entity.id = _.uuid();
    entity.metadata = undefined;
  }
  return { entity };
};

export default {{pascalCase name}}Edit;