import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    StatusBar,
    Image,
    Pressable,
    Button,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Dimensions,
    FlatList,
    ActivityIndicator
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
  
  import { useState, useEffect, useRef, useContext } from "react";
  import { getPostById } from "../service/PostService";
  
  import Comment from "../components/Comment";
  import Post from "../components/Post";
  
  // import commentList from '../data/comment.json';
  import { getCommentsByPostId, createComment } from "../service/CommentService";
  import { Context as AccountContext } from "../context/AccountContext";
  import { Context as PostContext } from "../context/PostContext";
  // Upload image
  import * as ImagePicker from "expo-image-picker";
  import { LogBox } from 'react-native';
  
  export default function PostDetailScreen({ route, navigation }) {
    const [userPost, setUserPost] = useState([]);
    
    const [commentText, setCommentText] = useState("");
    const [commentImage, setCommentImage] = useState(null);
    const [isCommentTextFocus, setIsCommentTextFocus] = useState(false);
    const [isSelectImage, setIsSelectImage] = useState(false);
    const [isCommentValid, setIsCommentValid] = useState(false);
    //
    const [isReplying, setIsReplying] = useState(false);
    const [commentIdReplying, setCommentIdReplying] = useState(null);
    const [nameReplying, setNameReplying] = useState("");
    const [commentList, setCommentList] = useState([]);
    // focus vào TextInput để viết comment khi isReplying là true
    const commentInputRef = useRef(null);
    const { state } = useContext(AccountContext);
    const { getPosts } = useContext(PostContext);
    // refactor lại listHeader của FlatList
    const [postId, setPostID] = useState(route?.params?.postId);
    const [commentId, setCommentId] = useState(route?.params?.commentId);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
  
    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPostById(postId);
            setPost(post);
            // setLoading(false); // Set loading to false after data is fetched
        };
        fetchPost();
    }, [postId]);
  
    useEffect(() => {
      if (isReplying || isCommentTextFocus) {
        // Kiểm tra xem ref có tồn tại không trước khi gọi focus()
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        } else {
          commentInputRef.current.blur();
        }
      }
    }, [isReplying, isCommentTextFocus]);
  
    useEffect(() => {
      // console.log(commentIdReplying);
      // console.log(isReplying);
    }, [commentIdReplying, isReplying]);
  
    const fetchComments = async () => {
      const response = await getCommentsByPostId(route?.params?.postId);
      setCommentList(response);
      setLoading(false)
    };
  
    useEffect(() => {
      fetchComments();
    }, []);
    // image
    const pickImage = async () => {
      // no permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      // console.log(result);
  
      if (!result.canceled) {
        setCommentImage(result.assets[0].uri);
      }
    };
  
    useEffect(() => {
      if (isSelectImage) {
        pickImage();
      }
    }, [isSelectImage]);
  
    useEffect(() => {
      if (commentText || commentImage) {
        setIsCommentValid(true);
      } else {
        setIsCommentValid(false);
      }
    }, [commentText, commentImage]);
  
    // Scroll to comment when reply
    const [coords, setCoords] = useState({});
    const flatListRef = useRef(null);
    const scrollToComment = (commentId) => {
      flatListRef?.current?.scrollToOffset({
        offset: coords[commentId] + 22,
        animated: true,
      });
      // console.log(coords[commentId]);
    };
  
    //
    const [dimensions, setDimensions] = useState({
      window: Dimensions.get("window"),
    });
  
    useEffect(() => {
      const subscription = Dimensions.addEventListener("change", ({ window }) => {
        setDimensions({ window });
      });
      return () => subscription?.remove();
    });
  
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);
  
    const { window } = dimensions;
    const windowWidth = window.width;
    const windowHeight = window.height;
  
    const updatePostById = async (postId) => {
      const update_post = await getPostById(postId);
      setUserPost(
        userPost.map((post) => (post.id === postId ? update_post : post))
      );
    };
  
    const submitComment = async () => {
      if (isCommentValid) {
        formData = new FormData();
  
        formData.append("id_account", state.account.id);
        if (commentIdReplying) {
          formData.append("to_comment_id", commentIdReplying);
        } 
        else 
          formData.append("id_post", route?.params?.postId);
  
        formData.append("content", commentText);
  
        if (commentImage) {
          formData.append("image", {
            name: "image.jpg",
            type: "image/jpeg",
            uri: commentImage,
          });
        }
  
        await createComment(formData);
        setCommentText("");
        setIsReplying(false);
        setCommentImage(null);
        getPosts();
        fetchComments();
        await route?.params?.onUpdatePost(route?.params?.postId);
      } else {
        alert("Invalid comment");
      }
    };
  
    if (loading) {
      return (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {/* <View style={styles.scrollContainer}> */}
          <FlatList
            ref={flatListRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
            style={{
              alignSelf: "flex-start",
              minWidth: "100%",
            }}
            data={commentList}
            renderItem={({ item, index }) => (
              <Comment
                item={item}
                setIsReplying={setIsReplying}
                setCommentText={setCommentText}
                commentIdReplying={commentIdReplying}
                setCommentIdReplying={setCommentIdReplying}
                setNameReplying={setNameReplying}
                scrollToComment={scrollToComment}
                coords={coords}
                setCoords={setCoords}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
            // ItemSeparatorComponent={
            //   <View style={{ height: 4, backgroundColor: '#ccc' }}></View>
            // }
            ListEmptyComponent={
              <Text
                style={{
                  color: "red",
                  fontSize: 24,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {/* No comment found */}
              </Text>
            } // display when empty data
            ListHeaderComponent={()=>{
              return post ? (
                <Post postType="POST_DETAIL" item={post} navigation={navigation} onUpdatePost={updatePostById} />
              ) : (
                  <ActivityIndicator size="large" color="#0000ff" />
              );
              }
            }
          />
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderTopColor: "#ccc",
              borderTopWidth: 1,
            }}
          >
            {isReplying && (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#65676B", fontSize: 15 }}>Replying</Text>
  
                <TouchableOpacity>
                  <Text
                    style={{
                      marginLeft: 4,
                      color: "#65676B",
                      fontWeight: "500",
                      fontSize: 15,
                    }}
                  >
                    {nameReplying}
                  </Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  onPress={() => {
                    setIsReplying(false);
                    setCommentIdReplying(null);
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 16,
                      fontWeight: "bold",
                      color: "#65676B",
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
  
            <TextInput
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "#f0f2f5",
                borderRadius: 24,
                color: "#050505",
                fontSize: 16,
              }}
              placeholder="Enter your comment"
              value={commentText}
              onChangeText={(text) => {
                setCommentText(text);
              }}
              onFocus={() => setIsCommentTextFocus(true)}
              onBlur={() => {
                setIsCommentTextFocus(false);
  
                // setIsReplying(false);
                // setCommentIdReplying(null);
              }}
              ref={commentInputRef}
              autoFocus={route?.params?.initialCommentFocus}
            />
            {isCommentTextFocus && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                {!commentImage && (
                  <Ionicons
                    name={isSelectImage ? "camera" : "camera-outline"}
                    size={24}
                    color={isSelectImage ? "black" : "#65676B"}
                    onPress={() => {
                      setIsSelectImage(!isSelectImage);
                    }}
                  />
                )}
  
                {commentImage && (
                  <View>
                    <Image
                      source={{ uri: commentImage }}
                      style={{
                        width: 100,
                        height: 100,
                        resizeMode: "cover",
                        borderRadius: 20,
                      }}
                    />
                    <Entypo
                      style={{ position: "absolute", left: "100%" }}
                      name="circle-with-cross"
                      size={24}
                      color="#ccc"
                      onPress={() => {
                        setIsSelectImage(false);
                        setCommentImage(null);
                      }}
                    />
                  </View>
                )}
  
                <FontAwesome
                  name={isCommentValid ? "send" : "send-o"}
                  size={24}
                  color={isCommentValid ? "#0866ff" : "#65676B"}
                  onPress={() => {
                    submitComment();
                  }}
                />
              </View>
            )}
          </View>
          {/* </View> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "white",
      paddingTop: StatusBar.currentHeight,
      // marginTop: StatusBar.currentHeight,
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
      padding: 16,
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
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      margin: 4,
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
  });
  