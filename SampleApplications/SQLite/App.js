/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './src/pages/HomeScreen';
import AddUser from './src/pages/AddUser';
import UpdateUser from './src/pages/UpdateUser';
import ViewUser from './src/pages/ViewUser';
import ViewUsersList from './src/pages/ViewUsersList';
import DeleteUser from './src/pages/DeleteUser';
import ImportDB from './src/pages/ImportDB';
import InitDB from './src/pages/InitDB';

const App = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'SQLite',
      headerTintColor: '#4486f5'
    },
  },
  View: {
    screen: ViewUser,
    navigationOptions: {
      title: 'View User',
      headerTintColor: '#4486f5'
    },
  },
  Add: {
    screen: AddUser,
    navigationOptions: {
      title: 'Add User',
      headerTintColor: '#4486f5'
    },
  },
  Update: {
    screen: UpdateUser,
    navigationOptions: {
      title: 'Update User',
      headerTintColor: '#4486f5'
    }
  },
  ViewAll: {
    screen: ViewUsersList,
    navigationOptions: {
      title: 'View Users',
      headerTintColor: '#4486f5'
    },
  },
  Delete: {
    screen: DeleteUser,
    navigationOptions: {
      title: 'Delete User',
      headerTintColor: '#4486f5'
    }
  },
  ImportDB: {
    screen: ImportDB,
    navigationOptions: {
      title: 'Import DB',
      headerTintColor: '#4486f5'
    }
  },
  InitDB: {
    screen: InitDB,
    navigationOptions: {
      title: 'Initialize DB',
      headerTintColor: '#4486f5'
    }
  }
});

export default createAppContainer(App);
