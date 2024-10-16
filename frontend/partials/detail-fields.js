{{#ifCond  @key '!=' 'id' ~}}
  {{#switch type}}
    {{#case 'relation'}}
        <span >
          {entity.{{camelCase @key}} && (
            {{#if original_relation}}
            <Link
              href={`/app/{{kebabCase (pluralize original_relation)}}/${entity.{{camelCase @key}}.id}`}
            >
              {{else}}
            <Link
              href={`/app/{{kebabCase (pluralize relation)}}/${entity.{{camelCase @key}}.id}`}
            >
              {{/if}}
          { getEntityName(entity, '{{camelCase @key}}') }
          </Link>
          )}
        </span>
    {{/case}}
    {{#case 'reference'}}
        <span >
          {entity.{{@key}} && (
            <Link
              href={`/app/{{kebabCase (pluralize referenceType)}}/${entity.{{@key}}.id}`}
            >
          { getEntityName(entity, '{{camelCase @key}}') }
          </Link>
          )}
        </span>
    {{/case}}
    {{#case 'html'}}
    { (entity.{{@key}} )
    && (
        <div
         // eslint-disable-next-line react/no-danger
         dangerouslySetInnerHTML={ {__html: entity.{{@key}} } } />
      )
    }
    {{/case}}
    {{#case 'htmlTextArea'}}
    { (entity.{{@key}} )
    && (
        <div
         // eslint-disable-next-line react/no-danger
         dangerouslySetInnerHTML={ {__html: entity.{{@key}} } } />
      )
    }
    {{/case}}
    {{#case 'markdown'}}
    { (entity.{{@key}} )
    && (
        <div
         // eslint-disable-next-line react/no-danger
         dangerouslySetInnerHTML={ {__html: marked.parse(entity.{{@key}}) } } />
      )
    }
    {{/case}}
    {{#case 'pipeString'}}
    { (entity.{{@key}} )
    && (
        <span >{(entity.{{@key}} || '').replace(/\|/g,' > ') }</span>
      )
    }
    {{/case}}
    {{#case 'boolean'}}
    { (entity.{{@key}} !== undefined)
    && (
        <span >{entity.{{@key}} ? 'Ja' : 'Nej' }</span>
      )
    }
    {{/case}}

    {{#case 'S3image' 'croppedS3image'}}
    { (entity.{{@key}} !== undefined)
    && (
    <Image src={ entity.{{@key}} } resX={100} resY={100} alt={entity.{{@key}} }/> )
  }
    {{/case}}

    {{#case 'openingHours'}}
    { (entity.{{@key}} !== undefined &&
      entity.{{@key}} !== null && entity.{{@key}} !== {})
    && (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={ {__html: domainModel.customerSubUnit.prettyPrintDeliveryDays(entity.{{@key}}).replace(/\n/g, '<br/>')} } />
    ) }
    {{/case}}

    {{#case 'date' 'deliveryDate'}}
    { (entity.{{@key}} || entity.{{@key}} === 0 )
    && (
        <span className="text-nowrap">{moment(entity.{{@key}} ).format("YYYY-MM-DD")}</span>
      )
    }
    {{/case}}

    {{#case 'datetime'}}
    { (entity.{{@key}} || entity.{{@key}} === 0 )
    && (
        <span className="text-nowrap">{moment(entity.{{@key}} ).format("YYYY-MM-DD HH:mm")}</span>
      )
    }
    {{/case}}
    {{#case 'money'}}
    { (
        <span ><Money currency={entity.currency} value={entity.{{@key}} }></Money></span>
      )
    }
    {{/case}}

    {{#case 'regionSpecifics'}}
    <RegionSpecifics value={entity.{{@key}} }/>
    {{/case}}
    {{#case 'attachments'}}
    { (entity.{{@key}} )
    && (
      <JSONViewer value={entity.{{@key}}.map(x=>x.filename)} />
      )
    }
    {{/case}}
    {{#case 'object' 'pageLayout' 'navbarConfig' 'cartProgressBarsColors' 'intercomConfig' 'imageArray' "stringArray" "referenceList" "articleFilterPanelConfig" "querySpecification" }}
    { (entity.{{@key}} )
    && (
      <JSONViewer value={entity.{{@key}} } />
      )
    }
    {{/case}}
    {{#case 'labels'}}
    { (entity.{{@key}} )
    && (
      <LabelBadges value={entity.{{@key}} } />
      )
    }
    {{/case}}
    {{#case 'enum' 'currency' }}
    { (entity.{{@key}} || entity.{{@key}} === 0 )
    && (
        <span >{getTranslation("{{parent}}.{{pluralize @key}}", entity.{{@key}} )}</span>
      )
    }
    {{/case}}
    {{#case 'text'}}
    { (entity.{{@key}} || entity.{{@key}} === 0 )
    && (
      <blockquote className="blockquote ml-2" style={ { whiteSpace: 'pre-line'} }>
      {entity.{{@key}} }
      </blockquote>
      )
    }
    {{/case}}
    {{#case 'userAccessString'}}
    {{/case}}
    {{#default}}
    { (entity.{{@key}}
      || entity.{{@key}} === 0 )
    && (
      {{#if restrictedValues}}
        <span >{getTranslation("{{parent}}.{{pluralize @key}}", entity.{{@key}} )}</span>
      {{else}}
        <span className="text-nowrap">{entity.{{@key}} }</span>
      {{/if}}
      )
    }
    {{/default}}
  {{/switch}}
{{/ifCond~}}
