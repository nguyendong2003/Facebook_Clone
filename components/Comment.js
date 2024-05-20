import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Feather,
  Ionicons,
  Fontisto,
  Entypo,
} from "@expo/vector-icons";

import { useState, useEffect, useRef } from "react";
import { getAccountById } from "../service/AccountService";
import moment from "moment";
export default function Comment({
  item,
  setIsReplying,
  commentIdReplying,
  setCommentIdReplying,
  setNameReplying,
  setCommentText,
  scrollToComment,
  coords,
  setCoords,
}) {
  const [isPressingLike, setIsPressingLike] = useState(false);
  const [valueReaction, setValueReaction] = useState(0);
  const [nameReaction, setNameReaction] = useState(null);
  const [colorReaction, setColorReaction] = useState("#65676B");
  const [account, setAccount] = useState({});
  // Scroll to comment when reply
  const scrollView = useRef(null);

  useEffect(() => {
    // Xác định màu dựa trên giá trị reaction
    // console.log(valueReaction);
    switch (valueReaction) {
      case 1:
        setColorReaction("#0866FF");
        setNameReaction("Like");

        break;
      case 2:
        setColorReaction("#F33E58");
        setNameReaction("Love");

        break;
      case 3:
        setColorReaction("#F7B125");
        setNameReaction("Care");

        break;
      case 4:
        setColorReaction("#F7B125");
        setNameReaction("Haha");

        break;
      case 5:
        setColorReaction("#F7B125");
        setNameReaction("Wow");

        break;
      case 6:
        setColorReaction("#E9710F");
        setNameReaction("Sad");
        break;
      case 7:
        setColorReaction("#E9710F");
        setNameReaction("Angry");
        break;

      default:
        setColorReaction("#65676B"); // Màu mặc định
    }
  }, [valueReaction]);

  //
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get("window"),
  });

  useEffect(() => {
    
    const fetchAccount = async (id) => {
      const response = await getAccountById(id);
      setAccount(response);
    };
    fetchAccount(item?.id_account);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  const { window } = dimensions;
  const windowWidth = window.width;
  const windowHeight = window.height;

  const ref = useRef();

  return (
    <View>
      <View
        ref={ref}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          // console.log(x, y, width, height);
          if (Object.keys(coords).length === 0) {
            coords[item.id] = y;
          } else {
            const previousKey =
              Object.keys(coords)[Object.keys(coords).length - 1];
            const previousValue = coords[previousKey];
            coords[item.id] = previousValue + height;
          }
        }}
        style={{
          flexDirection: "row",
          padding: 8,
          // marginLeft: marginLeftValue,
        }}
      >
        <TouchableOpacity>
          <Image
            source={account?.avatar == null ? require("../assets/defaultProfilePicture.jpg") : { uri: account?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 100 }}
          />
        </TouchableOpacity>

        <View style={{maxWidth: '80%'}}>
          <View
            style={{
              flex: 1,
              marginLeft: 8,
              borderRadius: 20,
              padding: 8,
              paddingLeft: 12,
              paddingRight: 12,
              backgroundColor:
                item.id === commentIdReplying ? "#ccc" : "#f0f2f5",
            }}
          >
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  color: "#050505",
                  fontWeight: "bold",
                }}
              >
                {account.profile_name}
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 15, color: "#050505" }}>
              {item?.content}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginTop: 4,
              // paddingBottom: 12,
            }}
          >
            {item?.image && (
              <Image
                source={{ uri: item?.image }}
                style={{
                  marginLeft: 8,
                  borderRadius: 20,
                  // width: 200,
                  height: 200,
                  width: "80%",
                  aspectRatio: 1,
                  resizeMode: "cover",
                  // marginTop: 8,
                  marginBottom: 6,
                }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginLeft: 16,
                  fontSize: 12,
                  color: "#65676B",
                  fontWeight: "500",
                }}
              >
                {moment(item?.create_time).fromNow()}
              </Text>

              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => {
                  setIsPressingLike(false);
                  if (valueReaction > 0) {
                    setValueReaction(0);
                  } else {
                    setValueReaction(1);
                  }
                }}
                onLongPress={() => setIsPressingLike(!isPressingLike)}
                delayLongPress={200}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: colorReaction,
                    fontWeight: "500",
                  }}
                >
                  {nameReaction ? nameReaction : "Like"}
                </Text>
                {isPressingLike && (
                  <View
                    style={{
                      position: "absolute",
                      top: -100,
                      left: -100,
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "white",
                      padding: 8,
                      borderRadius: 50,

                      shadowColor: "black",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(1);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-like.png")}
                        style={{ width: 44, height: 44, marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(2);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-heart.jpg")}
                        style={{ width: 40, height: 40 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(3);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-care2.jpg")}
                        style={{ width: 36, height: 36, marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(4);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-haha.png")}
                        style={{ width: 48, height: 48 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(5);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-wow.png")}
                        style={{ width: 36, height: 36 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: 4 }}
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(6);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-sad.jpg")}
                        style={{ width: 36, height: 36 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: 4 }}
                      onPress={() => {
                        setIsPressingLike(false);
                        setValueReaction(7);
                      }}
                    >
                      <Image
                        source={require("../assets/facebook-angry.png")}
                        style={{ width: 36, height: 36 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => {
                  setIsReplying(true);
                  setCommentIdReplying(item?.id);
                  setNameReplying(account.profile_name);
                  setCommentText(`${account.profile_name} `);
                  scrollToComment(item?.id);
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#65676B",
                    fontWeight: "500",
                  }}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: "#65676B" }}>
                {item?.["number-reaction"] > 9999
                  ? "9999+"
                  : item?.["number-reaction"] > 0
                  ? item?.["number-reaction"].toLocaleString()
                  : null}
              </Text>
              {item?.["number-reaction"] > 0 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/facebook-like.png")}
                      style={{ width: 20, height: 20, marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/facebook-haha.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/facebook-heart.jpg")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginLeft: 30 }}>
        {item?.answers?.map((reply) => (
          <Comment
            key={reply.id}
            item={reply}
            setIsReplying={setIsReplying}
            setCommentText={setCommentText}
            commentIdReplying={commentIdReplying}
            setCommentIdReplying={setCommentIdReplying}
            setNameReplying={setNameReplying}
            scrollToComment={scrollToComment}
            coords={coords}
            setCoords={setCoords}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    // marginTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "white",
    // padding: 16,
    paddingBottom: 8,
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  //
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  cardText: {
    // marginTop: 8,
    marginLeft: 10,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  //
  inputSearch: {
    marginLeft: 8,
    fontSize: 22,
    width: "90%",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",

    height: 40,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  // Dropdown
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  //button bottom post
  buttonBottomPost: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 4,
  },
  textBottomPost: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
    color: "#65676B",
  },
});
