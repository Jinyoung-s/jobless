import React from 'react';
import { View, TouchableOpacity, Dimensions, Text, Alert, Image } from 'react-native';
import { NavigationActions } from '@react-navigation/drawer'

export default class DrawerBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          idx: 0,
          title: 'menu1',
        },
        {
          idx: 1,
          title: 'menu2',
        },
        {
          idx: 2,
          title: 'menu3',
        },
        {
          idx: 3,
          title: 'LogOut',
        },
      ],
    };
  }

  navigateToScreen = route => () => {
    const navigate = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigate);
  };

  render() {
    return (
      <View
        style={{
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          backgroundColor: 'white',
          flex: 1,
        }}>
        <View
          style={{
            height: 200,
            backgroundColor: 'rgba(213,213,213,0.27)',
            borderTopRightRadius: 50,
            paddingTop: 50,
            paddingLeft: 30,
          }}>
          <Image
            style={{ height: 72, width: 72, borderRadius: 37 }}
            source={{ uri: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png' }}
          />
          <Text
            style={{
              marginTop: 15,
              fontSize: 26,
              fontWeight: 'bold',
              fontStyle: 'normal',
              lineHeight: 31,
              letterSpacing: 0,
              textAlign: 'left',
              color: '#272727',
            }}>
            airplane
          </Text>
        </View>
        <View>
          {this.state.list.map(data => (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingTop: 27,
                  paddingLeft: 30,
                }}
                onPress={() => {
                  data.idx === 8 ? this._logout() : Alert.alert('title', `1${data.idx}`);
                }}>
                <Text
                  style={{
                    marginLeft: 12,
                    color: '#272727',
                    fontSize: 16,
                    lineHeight: 19,
                  }}>
                  {data.title}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }
}