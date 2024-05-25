import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zkSync_datafeed_abi } from '../zkSync_DataFeed_ABI';
import { zkSync_sepolia_datafeed_address } from '../constants';

export default function DataFeed({ setMain, loadAR }) {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const web3 = new Web3("https://rpc.ankr.com/zksync_era_sepolia")
    const priceFeed = new web3.eth.Contract(zkSync_datafeed_abi, zkSync_sepolia_datafeed_address)

    const convertNumber = (num) => {
        // Convert the number to a string
        let numStr = num.toString();

        // Remove any trailing non-numeric characters
        numStr = numStr.replace(/[^0-9]+$/, '');

        const desiredDecimalPlaces = 8; // We want 8 decimal places

        if (numStr.length <= desiredDecimalPlaces) {
            // If the number length is less than or equal to the desired decimal places
            return '0.' + '0'.repeat(desiredDecimalPlaces - numStr.length) + numStr;
        }

        // Otherwise, insert the decimal point at the correct position
        let integerPart = numStr.slice(0, -desiredDecimalPlaces);  // Take all but the last 8 digits
        let decimalPart = numStr.slice(-desiredDecimalPlaces);     // Take the last 8 digits

        // Combine the integer and decimal parts
        let formattedNumber = `${integerPart}.${decimalPart}`;

        return formattedNumber;
    };


    const getPriceFeed = async () => {
        setLoading(true)
        let arr = []

        const d1 = await priceFeed.methods.getBTC_USD().call()
        arr.push({
            logo1: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png",
            logo2: "https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png",
            pair: "BTC / USD",
            price: convertNumber(d1)
        })

        const d2 = await priceFeed.methods.getETH_USD().call()
        arr.push({
            logo1: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
            logo2: "https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png",
            pair: "ETH / USD",
            price: convertNumber(d2)
        })

        const d3 = await priceFeed.methods.getLINK_USD().call()
        arr.push({
            logo1: "https://cryptologos.cc/logos/chainlink-link-logo.png",
            logo2: "https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png",
            pair: "LINK / USD",
            price: convertNumber(d3)
        })
        setData(arr)
        setLoading(false)
    }

    useEffect(() => {
        getPriceFeed()
    }, [])

    return (
        <View className='flex justify-center items-center mt-6'>
            <TouchableOpacity className='p-2 border border-white rounded-full' onPress={() => getPriceFeed()}>
                <MaterialCommunityIcons name="refresh" size={24} color={"rgb(100 116 139)"} />
            </TouchableOpacity>
            {
                !loading ? <ScrollView className='flex-1 mt-6' showsVerticalScrollIndicator={false}>
                    <View className=' flex justify-start items-center flex-col w-screen'>
                        {data.length != 0 ?
                            data.map((item, index) => (
                                <TouchableOpacity className='w-[90vw] bg-white p-2 mb-2 rounded-md flex justify-between flex-row items-center' key={index}
                                    onPress={() => {
                                        loadAR()
                                        setMain({ type: 'data_feed', image1: item.logo1, image2: item.logo2, pair: item.pair, price: item.price })
                                    }}
                                >
                                    <View className='flex justify-start items-center flex-row p-1'>
                                        <View className='flex flex-row'>
                                            <Image source={{ uri: item.logo1 }} className='w-8 h-8 rounded-full z-10' />
                                            <Image source={{ uri: item.logo2 }} className='w-8 h-8 rounded-full -ml-3' />
                                        </View>
                                        <Text className='text-slate-500 ml-2'>{item.pair}</Text>
                                    </View>
                                    <Text className='text-slate-700'>$ {(Number(item.price)).toFixed(2)}</Text>
                                </TouchableOpacity>
                            ))
                            : <View className='flex-1 flex justify-center items-center h-full w-screen mt-[200px]'><ActivityIndicator animating={true} color={'#000'} size={'large'} /></View>
                        }
                    </View>
                </ScrollView>
                    : <View className='flex-1 flex justify-center items-center h-full w-screen'><ActivityIndicator animating={true} color={'#000'} size={'large'} /></View>

            }
        </View>
    )
}