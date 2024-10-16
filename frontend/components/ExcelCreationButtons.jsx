/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React, { useState } from 'react';
import moment from 'moment';
import pluralize from 'pluralize';
import qs from 'qs';
import { Button } from 'reactstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Excel from 'exceljs';

import getAxiosInstance from 'app/config/api';
import { getTranslation, getTranslationWithEntityName } from 'domain-model';
import domainModel from 'domain-model';

export const EXCELEXPORTLIMIT = 30000;
const minColumnWidth = 10;

const getDisplayValueForEntity = (entity, entityName) =>
  domainModel.getEntityName({ [entityName]: entity }, entityName);

const getColumnsConfig = columns =>
  columns.map(headerString => ({
    header: headerString,
    width: Math.max(headerString.length, minColumnWidth),
  }));

async function createWorkBook(rows, columns) {
  const workbook = new Excel.Workbook();
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Export', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  const columnsConfig = getColumnsConfig(columns);
  sheet.columns = columnsConfig;
  rows.forEach(row => sheet.addRow(row));
  const wbout = await workbook.xlsx.writeBuffer();
  return wbout;
}

const getColumnNames = rowObjects => {
  const columns = {};
  rowObjects.forEach(row =>
    Object.keys(row).forEach(fieldName => {
      columns[fieldName] = true;
    }),
  );
  return Object.keys(columns);
};

const getRowArray = (rowObject, columns) => {
  const rowArray = [];
  for (let i = 0; i < columns.length; i++) {
    const value = _.get(rowObject, columns[i]);
    rowArray[i] = value;
  }
  return rowArray;
};

const toTableFormat = rowObjects => {
  const headers = _(getColumnNames(rowObjects)).sort().value();
  const rows = rowObjects.map(row => getRowArray(row, headers));
  return [rows, headers];
};

const resetLoadingState = setLoadingState => {
  setLoadingState(prevState => ({
    ...prevState,
    loading: true,
    progress: 0,
  }));
};

const updateLoadingState = (setLoadingState, page, totalPages) => {
  setLoadingState(prevState => ({
    ...prevState,
    loading: true,
    progress: Math.floor(100 * (page / (totalPages || 1))),
  }));
};

const setCompletedLoadingState = setLoadingState => {
  setLoadingState(prevState => ({ ...prevState, loading: false }));
};

const loadPaginatedData = async (
  { query, url, onStartLoading, onProgress, onComplete },
  setLoadingState,
) => {
  let page = 1;
  let response;
  const loadedData = { rows: [] };
  onStartLoading(setLoadingState);
  do {
    const queryStr = qs.stringify({
      page,
      cacheBuster: new Date().getTime(),
      ...query,
    });
    const requestUrl = `${url}?${queryStr}`;
    // eslint-disable-next-line no-await-in-loop
    response = await getAxiosInstance().get(requestUrl);
    loadedData.rows.push(...response.data.rows);
    if (response.data.columns && !loadedData.columns)
      loadedData.columns = response.data.columns; // Data.columns will exist when we are fetching data for a report. Only save columns once – they're the same across all pages

    onProgress(setLoadingState, page, response.data.totalPages || 1);
    if (loadedData.rows.length >= EXCELEXPORTLIMIT) {
      loadedData.rows.push({ id: 'Övre gräns för export är nådd' });
      break;
    }
    page++;
  } while (
    response.data.rows.length &&
    Number(page) <= Number(response.data.totalPages)
  );

  onComplete(setLoadingState);
  return loadedData;
};

const translateRow = (
  row,
  translateKeyOverride = null,
  translateValueOverride = null,
) => {
  const translateKey =
    translateKeyOverride || (key => getTranslationWithEntityName(key));

  const translateValue =
    translateValueOverride ||
    ((value, key) => getTranslation(pluralize(key), value));

  const translatedObject = {};
  Object.keys(row).forEach(key => {
    const value = row[key];
    const translatedKey = translateKey(key);
    const translatedValue = translateValue(value, key);
    if (translatedKey !== '') translatedObject[translatedKey] = translatedValue;
  });
  return translatedObject;
};

const formatRowValues = row => {
  const formatValue = (value, key) => {
    const isRelation = field => _.has(field, 'id');

    if (_.isArray(value) && _.every(value, _.isObject)) {
      return value
        .map(x => _.chain(x).omit(['id']).values().join('-').value())
        .join(', ');
    }
    if (moment.isDate(value)) {
      return moment(value).local().format('YYYY-MM-DD HH:mm');
    }
    if (isRelation(value)) {
      const relationEntityName = _.last(key.split('.'));
      return getDisplayValueForEntity(value, relationEntityName);
    }
    if (typeof value === 'boolean') {
      return value ? 'Ja' : 'Nej';
    }
    return value;
  };
  return _.mapValues(row, formatValue);
};

function ExcelCreationButton({
  className,
  entityName,
  reportName,
  dataLoader,
  dataTransform,
  options,
}) {
  const [loadingState, setLoadingState] = useState({
    loading: false,
    progress: 0,
  });

  const exportToExcel = async () => {
    const data = await dataLoader(options, setLoadingState);
    const rowObjects = dataTransform(data);
    const [rows, headers] = toTableFormat(rowObjects);
    const workbookOutput = await createWorkBook(rows, headers);

    const downloadUrl = URL.createObjectURL(
      new Blob([workbookOutput], { type: 'application/octet-stream' }),
    );
    /* trigger download with ful hack */
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    tempLink.setAttribute('download', `${entityName || reportName}.xlsx`);
    tempLink.click();
  };

  const { loading, progress } = loadingState;
  return (
    <Button
      className={`d-none d-md-inline-block ${className}`}
      onClick={exportToExcel}
      disabled={loading}
      color="secondary"
    >
      {!loading && 'Hämta som Excel'}
      {loading && (
        <>
          Skapar Excel-fil
          {progress} %
        </>
      )}
    </Button>
  );
}

function ListToExcel({ className, entityName, url, querySpecification }) {
  const shouldBeDisplayed = value =>
    _.isString(value) || _.isNumber(value) || _.isBoolean(value);

  function unpackObject(obj, result, path) {
    Object.keys(obj).forEach(key => {
      if (key === 'metadata') return;
      const relationValue = obj[key];
      if (!_.isArray(relationValue) && _.isObject(relationValue)) {
        unpackObject(relationValue, result, `${path}${key} `);
      } else {
        const translationPath = `${path}${key}`;
        const hasTranslation = getTranslation(translationPath);
        if (hasTranslation && shouldBeDisplayed(relationValue)) {
          result[translationPath] = relationValue;
        }
      }
    });
  }
  function getTranslationKeys(row) {
    const result = {};

    Object.keys(row).forEach(key => {
      if (key === 'metadata') return;
      const value = row[key];
      if (shouldBeDisplayed(value)) {
        result[`${entityName}.${key}`] = value;
      } else if (!_.isArray(value) && _.isObject(value)) {
        unpackObject(value, result, `${key}.`);
      }
    });
    return result;
  }
  const getDisplayValuesForListRow = row => {
    const translatableRow = getTranslationKeys(row);
    const translatedRow = translateRow(translatableRow);
    return formatRowValues(translatedRow);
  };
  const getDisplayValuesForList = ({ rows }) =>
    rows.map(getDisplayValuesForListRow);
  const options = {
    query: { query: querySpecification },
    url,
    onStartLoading: resetLoadingState,
    onProgress: updateLoadingState,
    onComplete: setCompletedLoadingState,
  };
  return (
    <ExcelCreationButton
      entityName={entityName}
      className={className}
      dataLoader={loadPaginatedData}
      dataTransform={getDisplayValuesForList}
      options={options}
    />
  );
}

function SupplierSalesReportToExcel({ supplierSalesReport, className }) {
  const loadSupplierSalesReportData = async (
    { url, onStartLoading, onComplete },
    setLoadingState,
  ) => {
    onStartLoading(setLoadingState);
    const response = await getAxiosInstance().get(`${url}`);
    onComplete(setLoadingState);
    return { rows: response.data.supplierSalesReportRows };
  };

  const getDisplayValuesForSupplierSalesReportRow = row => {
    const SSRS = 'supplierSalesReport.supplierSalesReportRows';
    const translatedRow = translateRow({
      [`${SSRS}.name`]: _.get(row, 'name'),
      [`${SSRS}.deliveredQuantity`]: _.get(row, 'deliveredQuantity'),
      [`${SSRS}.price`]: _.get(row, 'price'),
      [`${SSRS}.discount`]: _.get(row, 'discount'),
      [`${SSRS}.totalCommission`]: _.get(row, 'totalCommission'),
      [`${SSRS}.totalAlcoholTax`]: _.get(row, 'totalAlcoholTax'),
      [`${SSRS}.totalExcludingVAT`]: _.get(row, 'totalExcludingVAT'),
      [`${SSRS}.total`]: _.get(row, 'total'),
      'article.alcoholTaxClass': _.get(row, 'article.alcoholTaxClass'),
      'article.addRecycle': _.get(row, 'article.addRecycle'),
      'article.articleNumber': _.get(row, 'article.articleNumber'),
      'article.supplierArticleNumber': _.get(
        row,
        'article.supplierArticleNumber',
      ),
    });
    return formatRowValues(translatedRow);
  };

  const getDisplayValuesForSupplierSalesReport = ({ rows }) =>
    rows.map(getDisplayValuesForSupplierSalesReportRow);
  const url = `supplierSalesReports/${supplierSalesReport.id}`;
  return (
    <ExcelCreationButton
      reportName={`SupplierSalesReport_${supplierSalesReport.supplier.name}_${supplierSalesReport.startDate}_to_${supplierSalesReport.endDate}`}
      className={`d-none d-md-block ${className}`}
      dataLoader={loadSupplierSalesReportData}
      dataTransform={getDisplayValuesForSupplierSalesReport}
      options={{
        url,
        onStartLoading: resetLoadingState,
        onComplete: setCompletedLoadingState,
      }}
    />
  );
}

function SettlementToExcel({ settlement, className }) {
  const loadSettlementData = async (
    { url, onStartLoading, onComplete },
    setLoadingState,
  ) => {
    onStartLoading(setLoadingState);
    const response = await getAxiosInstance().get(`${url}`);
    onComplete(setLoadingState);
    return { rows: response.data.settlementRows };
  };

  const getDisplayValuesForSettlementRow = row => {
    const SSRS = 'settlement.settlementRows';
    const translatedRow = translateRow({
      [`${SSRS}.name`]: _.get(row, 'name'),
      [`${SSRS}.deliveredQuantity`]: _.get(row, 'deliveredQuantity'),
      [`${SSRS}.price`]: _.get(row, 'price'),
      [`${SSRS}.discount`]: _.get(row, 'discount'),
      [`${SSRS}.totalCommission`]: _.get(row, 'totalCommission'),
      [`${SSRS}.totalAlcoholTax`]: _.get(row, 'totalAlcoholTax'),
      [`${SSRS}.settlementOrderValue`]: _.get(row, 'settlementOrderValue'),
      'article.articleNumber': _.get(row, 'article.articleNumber'),
      'article.VAT': _.get(row, 'article.VAT', 25),
    });
    return formatRowValues(translatedRow);
  };

  const getDisplayValuesForSettlement = ({ rows }) =>
    rows.map(getDisplayValuesForSettlementRow);
  const url = `settlements/${settlement.id}`;

  const agreement =
    settlement.copackAgreement || settlement.orderBrokerageAgreement;

  return (
    <ExcelCreationButton
      reportName={`Settlement_${agreement.name}_${settlement.startDate}_to_${settlement.endDate}`}
      className={`d-none d-md-block ${className}`}
      dataLoader={loadSettlementData}
      dataTransform={getDisplayValuesForSettlement}
      options={{
        url,
        onStartLoading: resetLoadingState,
        onComplete: setCompletedLoadingState,
      }}
    />
  );
}

function ReportToExcel({ className, name, url, reportParameters }) {
  const getDisplayValuesForReport = ({ rows, columns }) => {
    const translateKeyForReport = key =>
      _.find(columns, x => x.name === key).localizedName;
    const translateValueForReport = (value, key) => {
      const column = _.find(columns, x => x.name === key);
      switch (column.type) {
        case 'enum': {
          return getTranslation(column.enumTranslation, value);
        }
        default:
          return value;
      }
    };

    const getDisplayValuesForReportRow = row => {
      const rowFilteredByColumnsDefinition = _.pick(
        row,
        columns.map(x => x.name),
      );
      const translatedRow = translateRow(
        rowFilteredByColumnsDefinition,
        translateKeyForReport,
        translateValueForReport,
      );
      return formatRowValues(translatedRow);
    };
    return rows.map(getDisplayValuesForReportRow);
  };
  const options = {
    query: reportParameters,
    url,
    onStartLoading: resetLoadingState,
    onProgress: updateLoadingState,
    onComplete: setCompletedLoadingState,
  };
  return (
    <ExcelCreationButton
      reportName={name}
      className={className}
      dataLoader={loadPaginatedData}
      dataTransform={getDisplayValuesForReport}
      options={options}
    />
  );
}

export {
  ListToExcel,
  SupplierSalesReportToExcel,
  ReportToExcel,
  SettlementToExcel,
};
ExcelCreationButton.propTypes = {
  className: PropTypes.string,
  entityName: PropTypes.string,
  reportName: PropTypes.string,
  dataLoader: PropTypes.func.isRequired,
  dataTransform: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};

ExcelCreationButton.defaultProps = {
  className: '',
  entityName: undefined,
  reportName: undefined,
};

ListToExcel.propTypes = {
  entityName: PropTypes.string.isRequired,
  querySpecification: PropTypes.object,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ListToExcel.defaultProps = {
  querySpecification: {},
  className: '',
};

SupplierSalesReportToExcel.propTypes = {
  supplierSalesReport: PropTypes.object.isRequired,
  className: PropTypes.string,
};

SupplierSalesReportToExcel.defaultProps = {
  className: '',
};

ReportToExcel.propTypes = {
  name: PropTypes.string.isRequired,
  reportParameters: PropTypes.object,
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ReportToExcel.defaultProps = {
  className: '',
  reportParameters: {},
};
