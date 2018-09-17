import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';

import copyAndRemove from './copy-and-remove';
import {
  applyConfiguration,
  closeConfiguration,
  deselectBuildType,
  failedBuildTypesLoading,
  failedInvestigationsLoading,
  failedProjectsLoading,
  failedTeamcityServicesLoading,
  finishedBuildTypesLoading,
  finishedInvestigationsLoading,
  finishedProjectsLoading,
  finishedTeamcityServicesLoading,
  openConfiguration,
  selectBuildType,
  selectProject,
  selectTeamcityService,
  setInitialSettings,
  startedBuildTypesLoading,
  startedInvestigationsLoading,
  startedProjectsLoading,
  startedTeamcityServicesLoading,
  updateHideChildProjects,
  updateRefreshPeriod,
  updateShowGreenBuilds,
  updateTitle
} from './actions';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_PERIOD = 300;

const reduce = createReducer({
  [setInitialSettings]: (state, {teamcityService, refreshPeriod, investigations, investigationsCount}) => ({
    ...state,
    teamcityService,
    refreshPeriod: refreshPeriod || DEFAULT_PERIOD,
    investigations: investigations || [],
    investigationsCount
  }),
  [openConfiguration]: (state, isInitialConfiguration) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: true,
      title: state.title,
      refreshPeriod: state.refreshPeriod,
      selectedTeamcityService: state.teamcityService,
      selectedProject: state.project,
      showGreenBuilds: state.showGreenBuilds,
      hideChildProjects: state.hideChildProjects,

      isInitialConfiguration
    }
  }),
  [updateTitle]: (state, title) => ({
    ...state,
    configuration: {
      ...state.configuration,
      title
    }
  }),
  [startedTeamcityServicesLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: true
    }
  }),
  [finishedTeamcityServicesLoading]: (state, services) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: services,
      serviceLoadErrorMessage: null,
      selectedTeamcityService: state.configuration.selectedTeamcityService || services[0]
    }
  }),
  [failedTeamcityServicesLoading]: (state, serviceLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: [],
      serviceLoadErrorMessage
    }
  }),
  [selectTeamcityService]: (state, selectedService) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedTeamcityService: selectedService
    }
  }),
  [startedProjectsLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingProjects: true
    }
  }),
  [finishedProjectsLoading]: (state, projects) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingProjects: false,
      projects,
      projectLoadErrorMessage: null
    }
  }),
  [failedProjectsLoading]: (state, projectLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingProjects: false,
      projects: [],
      projectLoadErrorMessage
    }
  }),
  [selectProject]: (state, selectedProject) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedProject,
      projectsAndBuildTypes: [],
      selectedBuildTypes: [],
      buildTypeLoadErrorMessage: null
    }
  }),
  [startedBuildTypesLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingBuildTypes: true
    }
  }),
  [finishedBuildTypesLoading]: (state, projectsAndBuildTypes) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingBuildTypes: false,
      projectsAndBuildTypes,
      buildTypeLoadErrorMessage: null
    }
  }),
  [failedBuildTypesLoading]: (state, buildTypeLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingProjects: false,
      projects: [],
      buildTypeLoadErrorMessage
    }
  }),
  [selectBuildType]: (state, selectedBuildType) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedBuildTypes: [
        ...state.configuration.selectedBuildTypes,
        selectedBuildType
      ]
    }
  }),
  [deselectBuildType]: (state, unselectedBuildType) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedBuildTypes: copyAndRemove(state.configuration.selectedBuildTypes, unselectedBuildType, (a, b) => a.id === b.id)
    }
  }),
  [updateShowGreenBuilds]: (state, showGreenBuilds) => ({
    ...state,
    configuration: {
      ...state.configuration,
      showGreenBuilds
    }
  }),
  [updateHideChildProjects]: (state, hideChildProjects) => ({
    ...state,
    configuration: {
      ...state.configuration,
      hideChildProjects
    }
  }),
  [updateRefreshPeriod]: (state, refreshPeriod) => ({
    ...state,
    configuration: {
      ...state.configuration,
      refreshPeriod
    }
  }),
  [applyConfiguration]: state => ({
    ...state,
    refreshPeriod: state.configuration.refreshPeriod,
    title: state.configuration.title,
    teamcityService: state.configuration.selectedTeamcityService,
    project: state.configuration.selectedProject,
    showGreenBuilds: state.configuration.showGreenBuilds,
    hideChildProjects: state.configuration.hideChildProjects
  }),
  [closeConfiguration]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: false
    }
  }),
  [startedInvestigationsLoading]: state => ({
    ...state,
    isLoadingInvestigations: true
  }),
  [finishedInvestigationsLoading]: (state, {investigations, investigationsCount}) => ({
    ...state,
    investigations,
    investigationsCount,
    isLoadingInvestigations: false,
    investigationLoadErrorMessage: null
  }),
  [failedInvestigationsLoading]: (state, investigationLoadErrorMessage) => ({
    ...state,
    investigations: [],
    investigationsCount: -1,
    isLoadingInvestigations: false,
    investigationLoadErrorMessage
  })
}, {
  teamcityService: {},
  project: null,
  showGreenBuilds: false,
  hideChildProjects: false,

  investigations: [],
  isLoadingInvestigations: false,
  investigationLoadErrorMessage: null,
  investigationsCount: -1,
  title: null,
  refreshPeriod: DEFAULT_PERIOD,
  configuration: {
    isConfiguring: false,
    isInitialConfiguration: false,

    title: '',

    refreshPeriod: null,

    teamcityServices: [],
    isLoadingServices: false,
    selectedTeamcityService: null,
    serviceLoadErrorMessage: null,

    projects: [],
    isLoadingProjects: false,
    selectedProject: null,
    projectLoadErrorMessage: null,

    projectsAndBuildTypes: [],
    isLoadingBuildTypes: false,
    selectedBuildTypes: [],
    buildTypeLoadErrorMessage: null,

    showGreenBuilds: false,
    hideChildProjects: false
  }
});

export default (dashboardApi, registerWidgetApi) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reduce, composeEnhancers(applyMiddleware(
    thunkMiddleware.withExtraArgument({dashboardApi, registerWidgetApi})
  )));
};
