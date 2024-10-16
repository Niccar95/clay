/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import domainModel from 'domain-model';
import {
  Button, Modal, ModalHeader, ModalBody, FormText
} from 'reactstrap';
import RequiresRole from 'flaivy-react/components/RequiresRole';
import { faEdit, faTrash, faTimes, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  {{pascalCase name }}Form,
} from './{{pascalCase name}}Form';


const iconMap = {
  edit: faEdit,
  trash: faTrash,
  times: faTimes,
  untrash: faTrashArrowUp,
};

class {{ pascalCase name }}ModalForm extends React.Component {
  static get propTypes() {
    return {
      entity: PropTypes.object.isRequired,
      buttonText: PropTypes.string,
      sessionUser: PropTypes.object.isRequired,
      submitButtonText: PropTypes.string,
      disabled: PropTypes.bool,
      immutableFields: PropTypes.object,
      onSubmit: PropTypes.func,
      translateError: PropTypes.func,
      transformParamsPreSubmit: PropTypes.func,
      color: PropTypes.string,
      size: PropTypes.string,
      icon: PropTypes.string,
      className: PropTypes.string,
      btnBlock: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      immutableFields: {},
      onSubmit: async () => {},
      translateError: (err) => _.get(err, 'response.data.message', JSON.stringify(err)),
      transformParamsPreSubmit: (params) => params,
      color: undefined,
      size: undefined,
      disabled: false,
      icon: undefined,
      submitButtonText: "{{#if submitButtonText}}{{submitButtonText}}{{else}}{{#if localized_name}}{{localized_name}}{{else}}Spara{{/if}}{{/if}}",
      buttonText: "{{#if submitButtonText}}{{submitButtonText}}{{else}}{{#if localized_name}}{{localized_name}}{{else}}Spara{{/if}}{{/if}}",
      className: '',
      btnBlock: false
    };
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  onSubmit(formsy, result) {
    const { onSubmit } = this.props;
    this.toggle();
    if (onSubmit) {
      onSubmit(formsy, result);
    }
  }

  toggle() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  render() {

    /* eslint-disable no-unused-vars */
    const {
      props: {
        immutableFields, entity, color, size, disabled, icon, sessionUser, buttonText, submitButtonText, className, btnBlock, transformParamsPreSubmit, translateError
      },
      state: { isOpen },
    } = this;
    const requiredRoles = [{{#each requiredRole}}"{{this}}",{{/each}}];
    /* eslint-enable */
    {{#if availableIf }} if(!( {{{availableIf}}} )) { return null }{{/if}}


    return (
      <>
      <RequiresRole requiredRoles={requiredRoles}>
      <Modal isOpen={isOpen} toggle={this.toggle} size={size} backdrop="static"
        style={ size==="fullScreen"? {height: "100%", width:"100%", maxWidth: "100%"}:{} }>
        <ModalHeader toggle={this.toggle}>{ "{{localized_name}}" }</ModalHeader>
        <ModalBody>
        {{#if description}}
          <FormText color="muted">
            {{description}}
          </FormText>
          {{/if}}
          <{{pascalCase name}}Form
            onSubmit={this.onSubmit}
            translateError={translateError}
            transformParamsPreSubmit={transformParamsPreSubmit}
            entity={entity}
            immutableFields={immutableFields}
            submitButtonText={submitButtonText}
            modal={true}
          />
        </ModalBody>
      </Modal>
      {icon && <span onClick={this.toggle} role="link"
                     onKeyPress={(e)=>{ if(e.keyCode===13) this.toggle()} }
              className="d-print-none"
              >
             <FontAwesomeIcon icon={iconMap[icon]}/>
      </span>}
      {!icon && <Button onClick={this.toggle}
              id="{{name}}Button"
              className={`float-end d-print-none ${className}`}
              disabled={disabled}
              block={btnBlock}
              color={color || "{{#if color}}{{color}}{{else}}secondary{{/if}}"}>
              {buttonText}
      </Button> }
      </RequiresRole></>
    );
  }
};

const mapStateToProps = (
  { authentication: { sessionUser } },
  { onSubmit, immutableFields, entity },
  ) => ({
  entity,
  sessionUser,
  onSubmit,
  immutableFields,
});

const {{ camelCase name }}Export = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(
  {{pascalCase name}}ModalForm,
);

// eslint-disable-next-line import/prefer-default-export
export { {{ camelCase name }}Export as {{pascalCase name}}ModalForm };
