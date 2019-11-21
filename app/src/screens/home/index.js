import React, {Component} from 'react';
import {
  StatusBar,
  Image,
  View,
  ScrollView,
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
  Content,
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

export default class Home extends Component {
  static navigationOptions = {
    title: SCREENS.HOME,
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      drawer: {
        name: 'Inicia sesión para ver tu perfil',
        sni: '',
        user: '',
        amount: 0,
      },
      register: {
        name: '',
        fname: '',
        lname: '',
        sni: '',
        user: '',
        password: '',
        cpassword: '',
      },
      login: {
        user: '',
        password: '',
        amount: 2000,
      },
      nS: 0,
      aS: 0,
      nC: 0,
      aC: 0,
      nL: 0,
      aL: 0,
      isLogged: false,
      isRecharge: false,
      position: 1,
      interval: null,
      drawerState: false,
      active: false,
      isLoading: false,
      visibleSignIn: false,
      visibleLogin: false,
      selected: '0',
      choosenIndex: 0,
      history: [],
      lotto: [],
      loteria: [],
      chances: [],
      panamena: [],
      images: [{url: IconAd1}, {url: IconAd2}],
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    StatusBar.setHidden(true);
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

  _addCredit = () => {
    this.setState(prevState => ({
      isRecharge: true,
      drawer: {
        ...prevState.drawer,
        amount: this.state.drawer.amount + 1000,
      },
    }));
  };

  _historyChange = data => {
    temp = this.state.history;
    id =
    temp.push({description: data, id});
    this.setState({
      history: temp,
    });
  };

  _drawerState = ratio => {
    if (ratio != 0) {
      return colors.overlay;
    } else {
      return colors.transparent;
    }
  };

  _playGame = (game, number, amount) => {
    if (amount <= this.state.drawer.amount) {
      if (game == '0') {
        let temp = this.state.lotto;
        temp.push([number, amount]);
        this.setState({
          lotto: temp,
        });
      } else if (game == '1') {
        let temp = this.state.lotto;
        temp.push([number, amount]);
        this.setState({
          loteria: temp,
        });
      } else if (game == '2') {
        let temp = this.state.lotto;
        temp.push([number, amount]);
        this.setState({
          chances: temp,
        });
      } else if (game == '3') {
        let temp = this.state.lotto;
        temp.push([number, amount]);
        this.setState({
          panamena: temp,
        });
      }
      this.setState(prevState => ({
        drawer: {
          ...prevState.drawer,
          amount: this.state.drawer.amount - Number(amount),
        },
      }));
      this._historyChange(
        'Jugaste ' + amount + ' colones ' + 'del número ' + number,
      );
      console.log(this.state.history);
    } else {
      alert('Saldo insuficiente');
    }
  };

  _verificar = () => {
    for (i = 0; i < this.state.chances.length; i++) {
      if (Number(this.state.chances[i][0]) == 35) {
        let algo = Number(this.state.chances[i][1]) * 80;
        this.setState(prevState => ({
          drawer: {
            ...prevState.drawer,
            amount: this.state.drawer.amount + algo,
          },
        }));
        alert('Ganaste con el número 35, en el juego Chances');
      }
    }
  };

  _login = () => {
    if (this.state.login.user != '' && this.state.login.password != '') {
      if (this.state.login.password == this.state.register.password) {
        this.setState({
          isLogged: true,
          drawer: {
            name:
              this.state.register.name +
              ' ' +
              this.state.register.fname +
              ' ' +
              this.state.register.lname,
            sni: this.state.register.sni,
            user: this.state.register.user,
            amount: this.state.login.amount,
          },
        });
        this.setState({visibleLogin: false});
      } else {
        Alert.alert(
          TITLES.LOGIN,
          'Usuario o contraseña incorrecta',
          [{text: BUTTONS.OK}],
          {cancelable: false},
        );
      }
    } else {
      Alert.alert(
        TITLES.LOGIN,
        'Debe ingresar usuario y contraseña',
        [{text: BUTTONS.OK}],
        {cancelable: false},
      );
    }
  };

  _logout = () => {
    this.setState({
      drawer: {
        name: 'Inicia sesión para ver tu perfil',
        sni: '',
        user: '',
        amount: 0,
      },
      register: {
        name: '',
        fname: '',
        lname: '',
        sni: '',
        user: '',
        password: '',
        cpassword: '',
      },
      login: {
        user: '',
        password: '',
      },
    });
  };

  _onLoginTextChangedPassword = event => {
    event.persist();
    this.setState(prevState => ({
      login: {
        ...prevState.login,
        password: event.nativeEvent.text,
      },
    }));
  };

  _onLoginTextChangedUser = event => {
    event.persist();
    this.setState(prevState => ({
      login: {
        ...prevState.login,
        user: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedCpassword = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        cpassword: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedCpassword = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        cpassword: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedFname = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        fname: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedLname = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        lname: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedName = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        name: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedPassword = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        password: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedSni = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        sni: event.nativeEvent.text,
      },
    }));
  };

  _onRegisterTextChangedUser = event => {
    event.persist();
    this.setState(prevState => ({
      register: {
        ...prevState.register,
        user: event.nativeEvent.text,
      },
    }));
  };

  _onNumberSj = event => {
    this.setState({
      nS: event.nativeEvent.text,
    });
  };

  _onNumberC = event => {
    this.setState({
      nC: event.nativeEvent.text,
    });
  };

  _onNumberL = event => {
    this.setState({
      nL: event.nativeEvent.text,
    });
  };

  _onAmountSj = event => {
    this.setState({
      aS: event.nativeEvent.text,
    });
  };

  _onAmountC = event => {
    this.setState({
      aC: event.nativeEvent.text,
    });
  };

  _onAmountL = event => {
    this.setState({
      aL: event.nativeEvent.text,
    });
  };

  _register = () => {
    if (
      this.state.register.name != '' &&
      this.state.register.fname != '' &&
      this.state.register.lname != '' &&
      this.state.register.sni != '' &&
      this.state.register.user != '' &&
      this.state.register.password != '' &&
      this.state.register.cpassword != ''
    ) {
      if (this.state.register.password == this.state.register.cpassword) {
        this.setState({visibleSignIn: false});
      } else {
        Alert.alert(
          TITLES.REGISTRO,
          'La contraseña no coincide',
          [{text: BUTTONS.OK}],
          {
            cancelable: false,
          },
        );
      }
    } else {
      Alert.alert(
        TITLES.REGISTRO,
        'Todos los campos son obligatorios',
        [{text: BUTTONS.OK}],
        {cancelable: false},
      );
    }
  };

  render() {
    return (
      <Drawer
        type="overlay"
        ref={ref => (this._drawer = ref)}
        content={
          <StyleProvider style={getTheme(platform)}>
            <View style={styles.container}>
              <Container>
                <Card>
                  <CardItem bordered>
                    <Text>{this.state.drawer.name}</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>Cédula: {this.state.drawer.sni}</Text>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Text>Usuario: {this.state.drawer.user}</Text>
                  </CardItem>
                  <CardItem>
                    <Text>Saldo: &#8353; {this.state.drawer.amount}</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Button
                        style={{backgroundColor: '#FCB537'}}
                        onPress={this._verificar}
                        block>
                        <Text style={{color: '#fff'}}>Verificar</Text>
                      </Button>
                      <Button
                        style={{backgroundColor: '#FCB537'}}
                        onPress={this._logout}
                        block>
                        <Text style={{color: '#fff'}}>Cerrar Sesión</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              </Container>
            </View>
          </StyleProvider>
        }
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
                          onPress={() => {
                            this._register();
                          }}
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
                                onChange={this._onRegisterTextChangedName}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Primer apellido
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                onChange={this._onRegisterTextChangedFname}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Segundo apellido
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                onChange={this._onRegisterTextChangedLname}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Cédula
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                onChange={this._onRegisterTextChangedSni}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Usuario
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                onChange={this._onRegisterTextChangedUser}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Contraseña
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'next'}
                                onChange={this._onRegisterTextChangedPassword}
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
                                onChange={this._onRegisterTextChangedCpassword}
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
                          onPress={() => {
                            this._login();
                          }}
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
                                onChange={this._onLoginTextChangedUser}
                              />
                            </Item>
                            <Item floatingLabel last>
                              <Label style={{color: colors.white}}>
                                Contraseña
                              </Label>
                              <Input
                                style={{color: colors.white}}
                                returnKeyType={'done'}
                                onChange={this._onLoginTextChangedPassword}
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
                {this.state.isLogged ? (
                  <ScrollView style={styles.container}>
                    <Card noShadow>
                      <CardItem>
                        <Body>
                          <Text>Pto de Venta: 305</Text>
                          <Text>Lugar: San José</Text>
                        </Body>
                      </CardItem>
                      <CardItem cardBody>
                        <Left>
                          <Text>Seleccione el juego:</Text>
                          <Picker
                            light
                            mode="dropdown"
                            iosHeader="Seleccione el juego"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{width: undefined, color: '#fff'}}
                            selectedValue={this.state.selected}
                            onValueChange={(itemValue, itemPosition) => {
                              this.setState({
                                selected: itemValue,
                                choosenIndex: itemPosition,
                              });
                            }}>
                            <Picker.Item label="LOTTO" value="0" />
                            <Picker.Item label="Loteria" value="1" />
                            <Picker.Item label="Chances" value="2" />
                            <Picker.Item label="Panameña" value="3" />
                          </Picker>
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
                                onChange={this._onNumberSj}
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
                                onChange={this._onAmountSj}
                              />
                            </Item>
                          </Form>
                        </View>
                      </CardItem>
                      <CardItem>
                        <Body>
                          <Button
                            style={{backgroundColor: '#FCB537'}}
                            onPress={this._playGame.bind(
                              null,
                              this.state.selected,
                              this.state.nS,
                              this.state.aS,
                            )}
                            block>
                            <Text style={{color: '#fff'}}>Jugar</Text>
                          </Button>
                        </Body>
                      </CardItem>
                    </Card>

                    <Card noShadow>
                      <CardItem>
                        <Body>
                          <Text>Pto de Venta: 306</Text>
                          <Text>Lugar: Cartago</Text>
                        </Body>
                      </CardItem>
                      <CardItem cardBody>
                        <Left>
                          <Text>Seleccione el juego:</Text>
                          <Picker
                            light
                            mode="dropdown"
                            iosHeader="Seleccione el juego"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{width: undefined, color: '#fff'}}
                            selectedValue={this.state.selected2}
                            onValueChange={(itemValue, itemPosition) => {
                              this.setState({
                                selected2: itemValue,
                                choosenIndex: itemPosition,
                              });
                            }}>
                            <Picker.Item label="LOTTO" value="0" />
                            <Picker.Item label="Loteria" value="1" />
                            <Picker.Item label="Chances" value="2" />
                            <Picker.Item label="Panameña" value="3" />
                          </Picker>
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
                                onChange={this._onNumberC}
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
                                onChange={this._onAmountC}
                              />
                            </Item>
                          </Form>
                        </View>
                      </CardItem>
                      <CardItem>
                        <Body>
                          <Button
                            style={{backgroundColor: '#FCB537'}}
                            onPress={this._playGame.bind(null, '0', 25, 100)}
                            block>
                            <Text style={{color: '#fff'}}>Jugar</Text>
                          </Button>
                        </Body>
                      </CardItem>
                    </Card>

                    {this.state.isRecharge ? (
                      <Card noShadow>
                        <CardItem>
                          <Body>
                            <Text>Pto de Venta: 307</Text>
                            <Text>Lugar: Limón</Text>
                          </Body>
                        </CardItem>
                        <CardItem cardBody>
                          <Left>
                            <Text>Seleccione el juego:</Text>
                            <Picker
                              light
                              mode="dropdown"
                              iosHeader="Seleccione el juego"
                              iosIcon={<Icon name="arrow-down" />}
                              style={{width: undefined, color: '#fff'}}
                              selectedValue={this.state.selected3}
                              onValueChange={(itemValue, itemPosition) => {
                                this.setState({
                                  selected33: itemValue,
                                  choosenIndex: itemPosition,
                                });
                              }}>
                              <Picker.Item label="LOTTO" value="0" />
                              <Picker.Item label="Loteria" value="1" />
                              <Picker.Item label="Chances" value="2" />
                              <Picker.Item label="Panameña" value="3" />
                            </Picker>
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
                                  onChange={this._onNumberL}
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
                                  onChange={this._onAmountL}
                                />
                              </Item>
                            </Form>
                          </View>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Button
                              style={{backgroundColor: '#FCB537'}}
                              onPress={this._playGame.bind(
                                null,
                                this.state.selected3,
                                25,
                                100,
                              )}
                              block>
                              <Text style={{color: '#fff'}}>Jugar</Text>
                            </Button>
                          </Body>
                        </CardItem>
                      </Card>
                    ) : null}

                    <Fab
                      active={this.state.active}
                      direction={PROPS.UP}
                      containerStyle={{}}
                      style={styles.fabBg}
                      position={PROPS.BOTTOM_RIGHT}
                      onPress={() => this._addCredit()}>
                      <Icon name={ICONS.MD_ADD} />
                    </Fab>
                  </ScrollView>
                ) : null}
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name={ICONS.MD_PAPER} />
                    <Text>{BUTTONS.HISTORIAL}</Text>
                  </TabHeading>
                }
                textStyle={styles.textTab}>
                <View style={styles.container}>
                  <FlatList
                    data={this.state.history}
                    renderItem={({item}) => (
                      <Card>
                        <CardItem bordered>
                          <Text>{item.description}</Text>
                        </CardItem>
                      </Card>
                    )}
                    keyExtractor={item => item.id}
                  />
                </View>
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
