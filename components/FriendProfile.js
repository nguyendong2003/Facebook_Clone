import {Image, View, Text, StyleSheet,TouchableOpacity, Pressable } from "react-native";
import listFriendProfile from '../data/listFriendProfile.json'
import { useNavigation } from "@react-navigation/native";


export default function FriendProfile({
    item,
    navigation
})
{
    // const navigation = useNavigation()
    return (

        <Pressable
        style={styles.friendContainer}
        onPress={() => {
            navigation.navigate('Profile', {isPersonalPage: false})
            console.log("aaa")
        }}
        >
            <Image 
                style={styles.friendAvatar}
                source={{uri: item?.avatar}}
            />
            <Text style={styles.friendName}>{item.name}</Text>
        </Pressable>

        
    )

}

const styles = StyleSheet.create({
    friendContainer:{
        flexDirection:"column",
        justifyContent: "flex-start",
        margin: 10,
        flex: 1
    },
    friendAvatar: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode:"cover"
        // width: "30%"
    },
    friendName: {
        fontSize: 15
    }
})