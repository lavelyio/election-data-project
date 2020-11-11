/* eslint-disable react/no-find-dom-node */
/* eslint-disable fp/no-mutation */
import * as React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {SaveTemplate, SelectTemplate} from './components';
import * as WebDataRocks from './webdatarocks/webdatarocks';
import './webdatarocks/webdatarocks.min.css';
import Icons from './icons';

class PivotInterface extends React.Component {
  webdatarocks;

  pivottoolbar;

  constructor(props) {
    super(props);

    this.state = {
      saveTemplateName: '',
      saveAsDefault: false,
      templates: null,
      selectedTemplate: null,
      savingSettings: false,
    };
  }

  componentDidUpdate(prevProps) {
    // console.log('updated: ', prevProps, this.props)
    /* if (
      prevProps.user.pivotTemplate !== this.props.user.pivotTemplate &&
      this.state.savingSettings
    ) {
      this.setState({savingSettings: false});
      Notify.success({message: 'Settings Updated.'});
    }
    */
  }

  componentDidMount() {
    const config = {};
    config.container = ReactDOM.findDOMNode(this);
    this.parseProps(config);
    this.webdatarocks = new WebDataRocks(config);
    this.webdatarocks.on('beforetoolbarcreated', this.customizeToolbar);
    this.webdatarocks.on('reportcomplete', () => {
      this.webdatarocks.expandAllData();
    });

    this.setState({
      saveTemplateName: '',
      templates: null,
      selectedTemplate: {},
    });
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    this.webdatarocks.dispose();
  }

  /**
   * Stage the template name for saving
   * @param {Event} e
   */
  handleTemplateNameChange = e => {
    const {value} = e.target;
    this.setState({saveTemplateName: value});
  };

  /**
   * Stage the save to user's settings conditional
   * @param {Event} e
   */
  handleSetAsDefault = e => {
    const {value} = e.target;
    this.setState({saveAsDefault: value === 'on'});
  };

  /**
   * Save the current pivot table configuration as a template
   * @async
   */
  saveTemplate = async () => {
    // call to API to save
    const {slice} = this.webdatarocks.getReport();

    // Validate template
    const error = this.validateTemplate(slice);

    if (error) {
      Notify.error({
        message: error,
      });
      return null;
    }

    // Template validated, create new Template
    const template = {
      name: this.state.saveTemplateName,
      created_by: this.props.user.fullName,
      created_at: new Date().toISOString(),
      slice,
    };

    const {status, statusText} = await savePivotTemplate(template);
    if (status !== 201)
      Notify.error({
        message: `Unable to save template. Status Code: ${status}. Error: ${statusText}`,
      });
    else {
      Notify.success({message: `Template Saved`});
      // If the user wants this as their default, set that via redux
      if (this.state.saveAsDefault) {
        const {error, settings} = this.props.user.updateTemplate(template);
        if (error) throw new Error(error);
        this.setState({savingSettings: true});
        this.props.updateSettings(settings);
      }
    }
  };

  /**
   * Ensure integrity of the template
   * @param {Object} template
   * @returns
   */
  validateTemplate = template => {
    let error = null;
    if (template.columns.length < 1)
      error += `Columns cannot be empty, please set a column value. \n`;
    if (template.rows.length < 1)
      error += `Rows cannot be empty, please set a row value.\n`;
    if (template.measures.length < 1)
      error += `Aggregation & Measures canot be empty, please define an aggregator or measure.\n`;
    return error;
  };

  /**
   * Stage the template for pivot re-render
   * @param {Object} template
   */
  handleSelectedTemplate = template => {
    this.setState({selectedTemplate: template});
  };

  /**
   * On Dialog button click, apply template to the pivot table
   * @param {Event} e
   */
  applyTemplate = e => {
    const _report = this.webdatarocks.getReport();
    _report.slice = this.state.selectedTemplate.slice;
    this.webdatarocks.setReport(_report);
  };

  /**
   * Save templates so we don't have to make another call
   * TODO: Push this to Redux
   * @param {Object} templates
   */
  updateTemplates = templates => {
    this.setState({templates});
  };

  /**
   * Renders a custom Dialog allowing the user to selet a pre-made
   *  `Template`, aka, pre-set columns, fields, filters, expands, etc.
   */
  selectTemplateDialog = () => {
    const dialog = this.pivottoolbar.popupManager.createPopup();
    dialog.content.classList.add('wdr-popup-w500');
    dialog.setTitle('Open Template');
    dialog.setToolbar([
      {
        id: 'wdr-btn-open',
        label: 'Open Template',
        handler: this.applyTemplate,
        isPositive: true,
      },
      {
        id: 'wdr-btn-cancel',
        label: this.pivottoolbar.Labels.cancel,
      },
    ]);

    const content = document.createElement('div');
    ReactDOM.render(
      <SelectTemplate
        handleSelectedTemplate={this.handleSelectedTemplate}
        onTemplates={this.updateTemplates}
        availableTemplates={this.state.templates}
      />,
      content
    );

    dialog.setContent(content);
    this.pivottoolbar.popupManager.addPopup(dialog.content);
  };

  /**
   * Renders a custom Dialog allowing the user to name the current template and save/ set as their default
   */
  saveTemplateDialog = () => {
    const dialog = this.pivottoolbar.popupManager.createPopup();
    dialog.content.classList.add('wdr-popup-w500');
    dialog.setTitle('Save these pivot options as a Template');
    dialog.setToolbar([
      {
        id: 'wdr-btn-open',
        label: 'Save Template',
        handler: this.saveTemplate,
        isPositive: true,
      },
      {
        id: 'wdr-btn-cancel',
        label: this.pivottoolbar.Labels.cancel,
      },
    ]);

    const content = document.createElement('div');
    ReactDOM.render(
      <SaveTemplate
        handleTemplateNameChange={this.handleTemplateNameChange}
        handleSetAsDefault={this.handleSetAsDefault}
      />,
      content
    );
    dialog.setContent(content);
    this.pivottoolbar.popupManager.addPopup(dialog.content);
  };

  /**
   * Before the final render, we need to modify the toolbar and add our dialog handlers
   * @param {Object} toolbar
   */
  customizeToolbar = toolbar => {
    const tabs = toolbar.getTabs();
    tabs.forEach(tab => {
      tab.icon = Icons[tab.title];
      if (tab.title === 'Save') tab.handler = this.saveTemplateDialog;
      if (tab.title === 'Open') {
        delete tab.menu;
        tab.handler = this.selectTemplateDialog;
      }
    });

    toolbar.getTabs = function () {
      delete tabs[0];
      return tabs;
    };
    this.pivottoolbar = toolbar;
  };

  /**
   * Parse Incoming Props to ready the component and more easily expose internal methods
   * @param {Object} config
   */
  parseProps(config) {
    if (this.props.toolbar !== undefined) {
      config.toolbar = this.props.toolbar;
    }
    if (this.props.width !== undefined) {
      config.width = this.props.width;
    }
    if (this.props.height !== undefined) {
      config.height = this.props.height;
    }
    if (this.props.report !== undefined) {
      config.report = this.props.report;
    }
    if (this.props.global !== undefined) {
      config.global = this.props.global;
    }
    if (this.props.customizeCell !== undefined) {
      config.customizeCell = this.props.customizeCell;
    }
    // events
    if (this.props.cellclick !== undefined) {
      config.cellclick = this.props.cellclick;
    }
    if (this.props.celldoubleclick !== undefined) {
      config.celldoubleclick = this.props.celldoubleclick;
    }
    if (this.props.dataerror !== undefined) {
      config.dataerror = this.props.dataerror;
    }
    if (this.props.datafilecancelled !== undefined) {
      config.datafilecancelled = this.props.datafilecancelled;
    }
    if (this.props.dataloaded !== undefined) {
      config.dataloaded = this.props.dataloaded;
    }
    if (this.props.datachanged !== undefined) {
      config.datachanged = this.props.datachanged;
    }
    if (this.props.fieldslistclose !== undefined) {
      config.fieldslistclose = this.props.fieldslistclose;
    }
    if (this.props.fieldslistopen !== undefined) {
      config.fieldslistopen = this.props.fieldslistopen;
    }
    if (this.props.filteropen !== undefined) {
      config.filteropen = this.props.filteropen;
    }
    if (this.props.fullscreen !== undefined) {
      config.fullscreen = this.props.fullscreen;
    }
    if (this.props.loadingdata !== undefined) {
      config.loadingdata = this.props.loadingdata;
    }
    if (this.props.loadinglocalization !== undefined) {
      config.loadinglocalization = this.props.loadinglocalization;
    }
    if (this.props.loadingreportfile !== undefined) {
      config.loadingreportfile = this.props.loadingreportfile;
    }
    if (this.props.localizationerror !== undefined) {
      config.localizationerror = this.props.localizationerror;
    }
    if (this.props.localizationloaded !== undefined) {
      config.localizationloaded = this.props.localizationloaded;
    }
    if (this.props.openingreportfile !== undefined) {
      config.openingreportfile = this.props.openingreportfile;
    }
    if (this.props.querycomplete !== undefined) {
      config.querycomplete = this.props.querycomplete;
    }
    if (this.props.queryerror !== undefined) {
      config.queryerror = this.props.queryerror;
    }
    if (this.props.ready !== undefined) {
      config.ready = this.props.ready;
    }
    if (this.props.reportchange !== undefined) {
      config.reportchange = this.props.reportchange;
    }
    if (this.props.reportcomplete !== undefined) {
      config.reportcomplete = this.props.reportcomplete;
    }
    if (this.props.reportfilecancelled !== undefined) {
      config.reportfilecancelled = this.props.reportfilecancelled;
    }
    if (this.props.reportfileerror !== undefined) {
      config.reportfileerror = this.props.reportfileerror;
    }
    if (this.props.reportfileloaded !== undefined) {
      config.reportfileloaded = this.props.reportfileloaded;
    }
    if (this.props.runningquery !== undefined) {
      config.runningquery = this.props.runningquery;
    }
    if (this.props.update !== undefined) {
      config.update = this.props.update;
    }
    if (this.props.beforetoolbarcreated !== undefined) {
      config.beforetoolbarcreated = this.customizeToolbar;
    }
  }

  render() {
    return <div> Pivot </div>;
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  pivotTemplates: state.pivotTemplates,
});

const mapDispatchToProps = dispatch => ({
  updateSettings: settings =>
    dispatch(authActions.authUpdateSettings(settings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PivotInterface);
