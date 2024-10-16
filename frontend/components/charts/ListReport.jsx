/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React from 'react';
import { Table, Row, Col } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { arrayMerge } from 'flaivy-react/utils/array-helper';
import qs from 'qs';
import moment from 'moment';
import _ from 'lodash';
import { ReportToExcel } from 'components/ExcelCreationButtons';
import SortDirection from 'flaivy-react/components/SortDirection';
import { DateRangePicker } from 'components/filters';
import Money from 'flaivy-react/components/Money';

import getAxiosInstance from 'app/config/api';
import domainModel from 'domain-model';
import Formsy from 'formsy-react';
import {
  TextInput,
  BooleanInput,
  Select,
} from 'flaivy-react/components/inputs';
import { SupplierSelect, ArticleSelect } from 'components/Selects';
import Link from 'next/link';
import Image from 'flaivy-react/components/Image';

_.mixin(require('lodash-uuid'));

function createFilterInput(filterable, onChange, activeFilters) {
  if (filterable.name === 'rangeColumn') {
    return <></>;
  }
  if (filterable.daterange) {
    return (
      <>
        {filterable.columnOptions && (
          <Select
            key="filterinput-range-option-picker"
            instanceId="select-range-option-picker"
            name="rangeColumn"
            placeholder="Skriv för att söka ..."
            value={filterable.columnOptions[0].column}
            onChange={onChange}
            options={filterable.columnOptions.map(x => ({
              value: x.column,
              label: x.localizedName,
            }))}
          />
        )}
        <strong>{filterable.localizedName}</strong>
        <DateRangePicker
          key={`filterinput-${filterable.name}`}
          name={filterable.name}
          onChange={onChange}
          rangeOnly
          value={_.get(activeFilters, filterable.name)}
        />
      </>
    );
  }

  if (filterable.relation) {
    switch (filterable.relation) {
      case 'supplier':
        return (
          <>
            <strong>{filterable.localizedName}</strong>
            <SupplierSelect
              key={`filterinput-${filterable.name}`}
              name={filterable.name}
              onChange={onChange}
              value={_.get(activeFilters, filterable.name)}
            />
          </>
        );
      case 'article':
        return (
          <>
            <strong>{filterable.localizedName}</strong>
            <ArticleSelect
              key={`filterinput-${filterable.name}`}
              name={filterable.name}
              onChange={onChange}
              value={_.get(activeFilters, filterable.name)}
            />
          </>
        );
      default:
        return <></>;
    }
  }
  switch (filterable.type) {
    case 'enum':
      return (
        <>
          <strong>{filterable.localizedName}</strong>
          <Select
            key={`filterinput-${filterable.name}`}
            instanceId="select-filter"
            name={filterable.name}
            placeholder="Skriv för att söka ..."
            value={_.get(activeFilters, filterable.name)}
            onChange={onChange}
            options={Object.keys(
              domainModel[filterable.entity][filterable.name + 's'],
            ).map(key => {
              return {
                value: key,
                label:
                  domainModel[filterable.entity][filterable.name + 's'][key],
              };
            })}
          />
        </>
      );

    case 'string':
      return (
        <>
          <strong>{filterable.localizedName}</strong>
          <TextInput
            key={`filterinput-${filterable.name}`}
            name={filterable.name}
            onChange={onChange}
            value={_.get(activeFilters, filterable.name)}
          />
        </>
      );
    case 'boolean':
      return (
        <>
          <strong>{filterable.localizedName}</strong>
          <BooleanInput
            id={`filterinput-${filterable.name}`}
            name={filterable.name}
            onChange={onChange}
            value={_.get(activeFilters, filterable.name)}
          />
        </>
      );
    default:
      return <></>;
  }
}
function FilterBar({ filterables, immutableFields, onChange, activeFilters }) {
  const hiddenParams = Object.keys(immutableFields);

  return (
    <Formsy>
      <Row>
        {filterables
          .filter(x => !_.includes(hiddenParams, x.name))
          .map(x => (
            <Col key={x.name} xs={12} md={4}>
              {createFilterInput(x, onChange, activeFilters)}
            </Col>
          ))}
      </Row>
    </Formsy>
  );
}
FilterBar.propTypes = {
  filterables: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  immutableFields: PropTypes.object.isRequired,
  activeFilters: PropTypes.object.isRequired,
};

function displayRelation(value, relation) {
  if (!value) {
    return <></>;
  }
  switch (relation) {
    case 'article':
      return (
        <div className="d-flex align-items-center">
          <Image
            resX={100}
            resY={100}
            className="ms-1 rounded"
            layout="fixed"
            src={value.image}
            alt="article"
          />
          <Link href={`/app/${relation}s/${value.id}`}>{value.name}</Link>
        </div>
      );
    case 'order':
      return (
        <Link href={`/app/${relation}s/${value.id}`}>
          {value.orderNumber || value.name}
        </Link>
      );
    case 'supplier':
      return <Link href={`/app/${relation}s/${value.id}`}>{value.name}</Link>;
    case 'customerSubUnit':
      return (
        <Link href={`/app/customer-sub-units/${value.id}`}>{value.name}</Link>
      );
    case 'shopUser':
      if (value.id) {
        return <Link href={`/app/shop-users/${value.id}`}>{value.email}</Link>;
      }
      return value.email;
    case 'priceList':
      return <Link href={`/app/price-lists/${value.id}`}>{value.name}</Link>;
    case 'complaint':
      return (
        <Link href={`/app/complaints/${value.id}`}>
          {value.complaintNumber}
        </Link>
      );
    case 'supplierCustomer':
      return (
        <Link href={`/app/supplier-customers/${value.id}`}>{value.name}</Link>
      );

    case 'invoice':
      return (
        <Link href={`/app/invoices/${value.id}`}>{value.invoiceNumber}</Link>
      );

    default:
      return value;
  }
}

function displayBoolean(value) {
  if (value) {
    return <div>Ja</div>;
  }
  return <div>Nej</div>;
}

function getDisplayElement(value, column) {
  const { relation, type, enumTranslation, precision = 0 } = column;
  switch (type) {
    case 'enum':
      return <div>{domainModel.getTranslation(enumTranslation, value)}</div>;
    case 'date':
      return <div>{value ? moment(value).format('YYYY-MM-DD') : ''}</div>;
    case 'number':
      return <div className="text-end">{_.round(value, precision)}</div>;
    case 'currency':
      return (
        <div className="text-end">
          <Money value={value}></Money>
        </div>
      );
    case 'orderArray':
      return (
        <ul>
          {value.map((x, i) => (
            <li key={i}>
              {displayRelation(x, 'order')} - {x.invoiceDate}
            </li>
          ))}
        </ul>
      );
    case 'boolean':
      return displayBoolean(value);
    case 'relation':
      return displayRelation(value, relation);
    case 'array':
      if (_.isNumber(value[0])) {
        return <div className="text-end">{value.join(', ')}</div>;
      }
      return value.join(' ');
    default:
      return value;
  }
}

function TableRow(entity, columns, rowFormatter) {
  return (
    // eslint-disable-next-line  no-underscore-dangle
    <tr key={entity.id} className={`text-nowrap ${rowFormatter(entity)}`}>
      {columns.map(c => (
        <td key={`${entity.id}  ${c.name}`} className="align-middle">
          {getDisplayElement(entity[c.name], c)}
        </td>
      ))}
    </tr>
  );
}

function AggregatesRow({ aggregates, columns }) {
  if (_.isEmpty(aggregates)) return <></>;
  return (
    <tr key="agg" className="text-nowrap">
      {columns.map((c, i) => {
        const value = aggregates[c.name];
        if (i === 0) {
          return (
            <td key={i}>
              <strong>Totalt</strong>
            </td>
          );
        }
        const displayElement = value ? getDisplayElement(value, c) : <></>;
        return (
          <td key={`agg${c.name}`} className="align-middle">
            <strong>{displayElement}</strong>
          </td>
        );
      })}
    </tr>
  );
}

AggregatesRow.propTypes = {
  aggregates: PropTypes.object,
  columns: PropTypes.array,
};

AggregatesRow.defaultProps = {
  columns: [],
  aggregates: {},
};

class ListReport extends React.Component {
  static get propTypes() {
    return {
      report: PropTypes.string.isRequired,
      immutableFields: PropTypes.object,
      rowFormatter: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      immutableFields: {},
      rowFormatter: () => '',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      hasMore: true,
      loading: false,
      total: 0,
      entities: [],
      columns: [],
      aggregates: {},
      filterables: [],
      activeFilters: {
        range: {
          between: [
            moment().clone().add(-30, 'days').format('YYYY-MM-DD'),
            moment().clone().format('YYYY-MM-DD'),
          ],
        },
      },
    };
    this.setSortHandler = this.setSortHandler.bind(this);
    this.fetchMoreAndSaveState = this.fetchMoreAndSaveState.bind(this);
    this.handleFilterBarChanged = this.handleFilterBarChanged.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
  }

  // this will generate one more request per page load.
  componentDidMount() {
    this.fetchMoreAndSaveState();
  }

  componentDidUpdate() {}

  async handleFilterBarChanged(key, value) {
    const currentlyActiveFilters = this.state.activeFilters;

    const immutableFields = this.props.immutableFields;
    const selected = _.get(value, 'id', value);
    await this.setState({
      activeFilters: {
        ...currentlyActiveFilters,
        [key]: selected,
        ...immutableFields,
      },
      hasMore: true,
      entities: [],
      currentPage: 0,
    });
  }

  async setSortHandler(value) {
    const { sort } = this.state;
    await this.setState({ sort: sort === value ? `-${value}` : value });
    await this.fetchMoreAndSaveState({ page: 1 });
  }

  async fetchMoreAndSaveState(queryParams) {
    const newState = await this.fetchMore({
      ...queryParams,
    });
    this.setState(newState);
  }

  async fetchMore(queryParams = {}) {
    const { report, immutableFields } = this.props;
    const { entities, currentPage, hasMore, sort, activeFilters, loading } =
      this.state;
    if (loading) {
      return null;
    }
    await this.setState({ loading: true });
    const page = queryParams.page || currentPage + 1;

    if (!hasMore && page !== 1) {
      await this.setState({ loading: false });
      return null;
    }

    const queryStr = qs.stringify({
      page,
      sort,
      ...activeFilters,
      ...immutableFields,
    });

    const requestUrl = `${report}?${queryStr}`;
    const response = await getAxiosInstance().get(requestUrl);
    const responseData = response.data;
    const columns = responseData.columns.filter(x => !x.onlyInExcel);
    const recievedEntities = responseData.rows.map(x => ({
      id: _.uuid(),
      ...x,
    }));
    const newHasMore = responseData.page < responseData.totalPages;
    let newEntities = [];
    if (responseData.page === 1) {
      newEntities = recievedEntities;
    } else {
      newEntities = arrayMerge(recievedEntities, entities);
    }
    await this.setState({ loading: false });
    const defaultSortColumn =
      columns.find(x => x.defaultSort) ||
      columns.find(x => x.type !== 'relation');

    const defaultSort = defaultSortColumn.sortColumn || defaultSortColumn.name;
    return {
      sort: sort || defaultSort,
      hasMore: newHasMore,
      isDeprecated: responseData.isDeprecated,
      total: responseData.total,
      entities: newEntities,
      currentPage: responseData.page,
      columns,
      filterables: responseData.filterables,
      aggregates: responseData.aggregates || {},
    };
  }

  render() {
    const {
      entities,
      aggregates,
      hasMore,
      currentPage,
      total,
      columns,
      filterables,
      sort,
      activeFilters,
      isDeprecated,
    } = this.state;
    const { report, immutableFields, rowFormatter } = this.props;

    const listElements = entities.map(entity =>
      TableRow(entity, columns, rowFormatter),
    );

    return (
      <>
        {isDeprecated && (
          <div className="alert alert-danger" role="alert">
            Denna rapport är depricerad och kommer att tas bort i framtida
            versioner - säkerställ att du kan få tag i den data du behöver på
            annat sätt
          </div>
        )}
        <FilterBar
          onChange={this.handleFilterBarChanged}
          filterables={filterables}
          immutableFields={immutableFields}
          activeFilters={activeFilters}
        />

        <Row className="mb-2">
          <Col>
            <h6 className="mt-2">
              Antal träffar:
              {total}
            </h6>
          </Col>
          <Col>
            <ReportToExcel
              reportParameters={{ ...activeFilters, ...immutableFields }}
              url={`${report}`}
              name={_.last(report.split('/'))}
              className="float-end"
            />
          </Col>
        </Row>

        <InfiniteScroll
          pageStart={currentPage}
          loadMore={this.fetchMoreAndSaveState}
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <Table className="table-striped table-bordered" responsive>
            <thead className="thead-light">
              <tr>
                {columns.map(x => {
                  const sortColumn = x.sortColumn || x.name;
                  return (
                    <th
                      style={{ cursor: x.sortable ? 'pointer' : 'auto' }}
                      className={`text-nowrap ${
                        x.sortable ? 'text-primary' : ''
                      } ${
                        x.type === 'currency' ||
                        x.type === 'number' ||
                        x.type === 'float'
                          ? 'text-end'
                          : ''
                      }`}
                      key={`header${x.localizedName}`}
                      onClick={() =>
                        x.sortable ? this.setSortHandler(sortColumn) : undefined
                      }
                    >
                      {x.localizedName}
                      {x.sortable && (
                        <SortDirection
                          myColumn={sortColumn}
                          activeColumn={sort}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{listElements}</tbody>
            <tfoot className="tfoot-light">
              <AggregatesRow aggregates={aggregates} columns={columns} />
            </tfoot>
          </Table>
          <div style={{ height: '250px' }}>&nbsp;</div>
        </InfiniteScroll>
      </>
    );
  }
}

export default ListReport;
