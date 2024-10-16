import { Label, Card, Row, Col } from 'reactstrap';
import { getTranslation, getEntityName } from 'domain-model';
import PropTypes from 'prop-types';
import moment from 'moment'
import Link from 'next/link';
import { RegionSpecifics } from 'flaivy-react/components/detail-fields';


export default function {{pascalCase name}}Card({entity}) {

  return (
    <Card id={entity.id} className="mx-n1 px-1 mt-1 mb-1 shadow-none border">
      <Row>
        {{#each fields}}
        {{#ifCond is_available_in_reference '==' true}}
          <Col> <Label>{{localized_name}}: </Label>
          {{#ifCond @index '==' 1}}
          <Link href={`/app/{{kebabCase (pluralize ../name)}}/${entity.id}`} passHref>
          {{/ifCond}}
          {{> detail-fields parent=../name }}
          {{#ifCond @index '==' 1}}
          </Link>
          {{/ifCond}}
          </Col>
        {{/ifCond}}
        {{/each}}
        {{#each calculatedFields}}
        {{#ifCond is_available_in_reference '==' true}}
          <Col> <Label>{{localized_name}}: </Label>
            {{> detail-fields parent=../name }}
          </Col>
        {{/ifCond}}
        {{/each}}
      </Row>
      </Card>
  )
}

{{pascalCase name}}Card.propTypes = {
  entity: PropTypes.object.isRequired,
};
