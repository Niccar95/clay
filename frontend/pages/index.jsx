import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import qs from 'qs';
import { withRouter } from 'next/router';
import {{pascalCase name}}CardListComponent from '../../../components/generated/{{pascalCase name}}CardListComponent';
import {
  refreshListOnQueryDiff,
  setListStore as _setListStore,
} from '../../../shared/actions/generated/{{kebabCase name}}.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function {{pascalCase (pluralize name)}}({ listStore, setListStore, router }) {
  const onQueryUpdate = (query, search) => {
    const href = `/app/{{camelCase (pluralize name)}}?${qs.stringify({ query })}&search=${search}`;
    router.replace(href, href, { shallow: true });
  }

  return (
    <>
      <Row className="align-items-center">
        <Col xs={6}>
          <h1>{{pascalCase localizedName}}</h1>
        </Col>
        <Col xs={6} className="text-end">
          <Link href="/app/{{kebabCase (pluralize name)}}/new/edit" passHref>
            <Button color="primary">
              <FontAwesomeIcon icon={faPlus} /> Skapa ny {{pascalCase localizedName}}
            </Button>
          </Link>
        </Col>
      </Row>

      <{{pascalCase name}}CardListComponent
        onQueryUpdate={onQueryUpdate}
        listStore={listStore}
        storeUpdate={setListStore}
      />
    </>
  );
}

{{pascalCase (pluralize name)}}.propTypes = {
  listStore: PropTypes.object.isRequired,
  setListStore: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
}


{{pascalCase (pluralize name)}}.getInitialProps = async({ reduxStore, query, req }) => {
  await reduxStore.dispatch(refreshListOnQueryDiff(qs.parse(query), req));
}

const mapStateToProps = ({ {{camelCase name}}List }) => ({
  listStore: {{camelCase name}}List,
});

const mapDispatchToProps = { setListStore: _setListStore };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter({{pascalCase (pluralize name)}}));