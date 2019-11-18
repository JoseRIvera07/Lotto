import React, {Component} from 'react';
import {
  StatusBar,
  Image,
  View,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {
  StyleProvider,
  Tab,
  Tabs,
  TabHeading,
  Icon,
  Text,
  Header,
  Left,
  Right,
  Body,
  Title,
  Container,
  Button,
  Form,
  Item,
  Input,
  Label,
  Fab,
  Card,
  CardItem,
  Thumbnail,
  Footer,
  FooterTab,
  Picker,
} from 'native-base';
import Dialog, {
  DialogTitle,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import getTheme from '../../../native-base-theme/components';
import platform from '../../../native-base-theme/variables/platform';
import {colors} from '../../config/styles';
import {
  SCREENS,
  ALERTS,
  PLACEHOLDERS,
  BUTTONS,
  TITLES,
  PROPS,
  ICONS,
} from '../../config/constants';
import client from '../../utils/client';
import imageUrlBuilder from '@sanity/image-url';
import NumericInput from 'react-native-numeric-input';
import IconLogo from '../../assets/logo.png';
import IconAd1 from '../../assets/ad1.png';
import IconAd2 from '../../assets/ad2.png';
import Drawer from 'react-native-drawer';
import Slideshow from 'react-native-image-slider-show';

const builder = imageUrlBuilder(client);

class ContentView extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to React Native!</Text>
        <Text>To get started, edit index.ios.js</Text>
        <Text>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
}

export default class Home extends Component {
  static navigationOptions = {
    title: SCREENS.HOME,
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      position: 1,
      interval: null,
      drawerState: false,
      active: false,
      isLoading: false,
      visibleSignIn: false,
      visibleLogin: false,
      selected: 'key1',
      games: [],
      images: [{url: IconAd1}, {url: IconAd2}],
    };
    this.arrayholder = [];
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    //await this._getGames();
  }

  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.images.length
              ? 0
              : this.state.position + 1,
        });
      }, 4000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  _getGames = email => {
    client
      .fetch(`*[_type == 'game' && user.sni == '304560456' ]{..., category->}`)
      .then(res => {
        this.setState({games: res});
        this.arrayholder = this.state.games;
        console.log(this.arrayholder);
      })
      .catch(err => {
        this.setState({isLoading: false});
        Alert.alert(SCREENS.HOME, ALERTS.FAILURE, [{text: BUTTONS.OK}], {
          cancelable: false,
        });
      });
  };

  _drawerState = ratio => {
    if (ratio != 0) {
      return colors.overlay;
    } else {
      return colors.transparent;
    }
  };

  _onValueChange(value: string) {
    this.setState({
      selected: value,
    });
  }

  render() {
    return (
      <Drawer
        type="overlay"
        ref={ref => (this._drawer = ref)}
        content={<ContentView />}
        tapToClose={true}
        openDrawerOffset={0.3}
        styles={drawerStyles}
        tweenHandler={ratio => ({
          mainOverlay: {backgroundColor: this._drawerState(ratio)},
        })}>
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={() => this._drawer.open()}>
                  <Icon name={ICONS.MD_MENU} style={{fontSize: 30}} />
                </Button>
              </Left>
              <Body>
                <Title>{TITLES.LOTTO}</Title>
              </Body>
              <Right></Right>
            </Header>
            <Tabs>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name={ICONS.MD_HOME} />
                    <Text>{BUTTONS.INICIO}</Text>
                  </TabHeading>
                }
                textStyle={styles.textTab}>
                <View style={styles.container}>
                  <View style={styles.adContainer}>
                    <Slideshow
                      dataSource={this.state.images}
                      height={515}
                      arrowSize={24}
                      position={this.state.position}
                      onPositionChanged={position => this.setState({position})}
                    />
                  </View>
                  <Footer>
                    <FooterTab>
                      <Button
                        onPress={() => {
                          this.setState({visibleSignIn: true});
                        }}
                        vertical>
                        <Icon name={ICONS.MD_PERSON_ADD} />
                        <Text>{BUTTONS.REGISTRARSE}</Text>
                      </Button>
                    </FooterTab>
                    <FooterTab>
                      <Button
                        onPress={() => {
                          this.setState({visibleLogin: true});
                        }}
                        vertical>
                        <Icon name={ICONS.MD_LOGIN} />
                        <Text>{BUTTONS.LOGIN}</Text>
                      </Button>
                    </FooterTab>
                  </Footer>
                  <Dialog
                    dialogStyle={{backgroundColor: colors.lightorange}}
                    visible={this.state.visibleSignIn}
                    onTouchOutside={() => {
                      this.setState({visibleSignIn: false});
                    }}
                    dialogAnimation={
                      new SlideAnimation({
                        slideFrom: 'top',
                      })
                    }
                    dialogTitle={
                      <DialogTitle
                        title={TITLES.REGISTRO}
                        textStyle={{color: colors.white}}
                        style={{backgroundColor: colors.lightred}}
                      />
                    }
                    footer={
                      <DialogFooter style={{backgroundColor: colors.lightred}}>
                        <DialogButton
                          text={BUTTONS.CANCELAR}
                          textStyle={{color: colors.white}}
                          onPress={() => {
                            this.setState({visibleSignIn: false});
                          }}
                        />
                        <DialogButton
                          text={BUTTONS.ACEPTAR}
                          textStyle={{color: colors.white}}
                          onPress={() => {}}
                        />
                      </DialogFooter>
                    }>
                    <DialogContent style={styles.dialogContainer}>
                      <View style={styles.signInContainer}>
                        <View style={styles.loginContainer}>
                          <Form>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Nombre
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Primer apellido
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Segundo apellido
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Cédula
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Usuario
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Contraseña
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                secureTextEntry
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Confirmar contraseña
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'done'}
                                secureTextEntry
                              />
                            </Item>
                          </Form>
                        </View>
                      </View>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    dialogStyle={{backgroundColor: colors.lightorange}}
                    visible={this.state.visibleLogin}
                    onTouchOutside={() => {
                      this.setState({visibleLogin: false});
                    }}
                    dialogAnimation={
                      new SlideAnimation({
                        slideFrom: 'bottom',
                      })
                    }
                    dialogTitle={
                      <DialogTitle
                        title={TITLES.LOGIN}
                        textStyle={{color: colors.white}}
                        style={{backgroundColor: colors.lightred}}
                      />
                    }
                    footer={
                      <DialogFooter style={{backgroundColor: colors.lightred}}>
                        <DialogButton
                          text={BUTTONS.CANCELAR}
                          textStyle={{color: colors.white}}
                          onPress={() => {
                            this.setState({visibleLogin: false});
                          }}
                        />
                        <DialogButton
                          text={BUTTONS.ACEPTAR}
                          textStyle={{color: colors.white}}
                          onPress={() => {}}
                        />
                      </DialogFooter>
                    }>
                    <DialogContent style={styles.dialogContainer}>
                      <View style={styles.signInContainer}>
                        <View style={styles.loginContainer}>
                          <Image source={IconLogo} style={styles.image} />
                          <Form>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Usuario
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Contraseña
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'done'}
                                secureTextEntry
                              />
                            </Item>
                          </Form>
                        </View>
                      </View>
                    </DialogContent>
                  </Dialog>
                </View>
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name={ICONS.MD_CUBE} />
                    <Text>{BUTTONS.JUEGOS}</Text>
                  </TabHeading>
                }
                textStyle={styles.textTab}>
                <View style={styles.container}>
                  <Card noShadow>
                    <CardItem>
                      <Body>
                        <Text>Pto de Venta: 306</Text>
                        <Text>Lugar: Cartago</Text>
                      </Body>
                      <Right>
                        <Text>Saldo: &#8353;2000</Text>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      <Left>
                        <Text>Seleccione el juego:</Text>
                        <Picker
                          light
                          mode="dropdown"
                          iosHeader="Select your SIM"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{width: undefined, color:'#fff'}}
                          selectedValue={this.state.selected}
                          onValueChange={this._onValueChange.bind(this)}>
                          <Picker.Item label="LOTTO" value="key0" />
                          <Picker.Item label="Loteria" value="key1" />
                        </Picker>
                        {/* <Button transparent>
                          <Text>Holi: hello</Text>
                        </Button> */}
                      </Left>
                    </CardItem>
                    <CardItem>
                          <View style={{flex: 1}}>
                            <Form>
                              <Item fixedLabel last>
                                <Label style={{color: colors.white}}>
                                Número #:
                                </Label>
                                <Input
                                  style={{color: colors.white}}
                                  returnKeyType={'next'}
                                  keyboardType={'numeric'}
                                />
                              </Item>
                            </Form>
                          </View>
                    </CardItem>
                    <CardItem>
                          <View style={{flex: 1}}>
                            <Form>
                              <Item fixedLabel last>
                                <Label style={{color: colors.white}}>
                                Monto &#8353;:
                                </Label>
                                <Input
                                  style={{color: colors.white}}
                                  returnKeyType={'done'}
                                  keyboardType={'numeric'}
                                />
                              </Item>
                            </Form>
                          </View>
                    </CardItem>
                    <CardItem>
                      <Body>
                        <Button style={{backgroundColor: '#FCB537'}} block>
                          <Text style={{color: '#fff'}}>Jugar</Text>
                        </Button>
                      </Body>
                    </CardItem>
                  </Card>
                  <FlatList
                    data={this.state.games}
                    renderItem={({item}) => (
                      <Card noShadow>
                        <CardItem button onPress={() => alert(item.name)}>
                          <Left>
                            <Thumbnail
                              square
                              source={{
                                uri: builder.image(item.image).url(),
                              }}
                            />
                            <Body>
                              <Text>{item.name}</Text>
                              <Text note>{item.category.name}</Text>
                            </Body>
                          </Left>
                        </CardItem>
                        <CardItem cardBody>
                          <Left>
                            <Button transparent>
                              <Text>
                                {TITLES.COD}: {item.code.current}
                              </Text>
                            </Button>
                          </Left>
                          <Right>
                            <Button transparent>
                              <Text>
                                {TITLES.STOCK}: {item.stock}
                              </Text>
                            </Button>
                          </Right>
                        </CardItem>
                      </Card>
                    )}
                    keyExtractor={item => item._id}
                  />
                  <Fab
                    active={this.state.active}
                    direction={PROPS.UP}
                    containerStyle={{}}
                    style={styles.fabBg}
                    position={PROPS.BOTTOM_RIGHT}
                    onPress={() => this.setState({active: !this.state.active})}>
                    <Icon name={ICONS.MD_ADD} />
                  </Fab>
                </View>
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name={ICONS.MD_PAPER} />
                    <Text>{BUTTONS.HISTORIAL}</Text>
                  </TabHeading>
                }
                textStyle={styles.textTab}>
                <View style={styles.container}></View>
              </Tab>
            </Tabs>
          </Container>
        </StyleProvider>
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightorange,
    flex: 1,
  },
  dialogContainer: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    height: 468,
    width: 320,
  },
  fabBg: {
    backgroundColor: colors.lightred,
  },
  image: {
    alignSelf: 'center',
    height: 200,
    width: 200,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loginContainer: {
    backgroundColor: colors.lightorange,
    flex: 1,
    justifyContent: 'center',
  },
  signInContainer: {
    backgroundColor: colors.transparent,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textTab: {
    color: colors.white,
  },
});
