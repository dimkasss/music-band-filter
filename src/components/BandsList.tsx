import React, { useState, useEffect } from 'react'
import bandTypeToEmoji from '../lib/bandTypeToEmoji'

type band<T> = {
    id: T
    implemented: T | void
    name: T | void
    bandtype: T | void
    country: T | void
    genre: T | void
}

const BandsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {

    const [ bandInput, setBandInput ] = useState<string>('')
    const [ databaseBands, setDatabaseBands ] = useState<any[]>([])
    const [ searchResult, setSearchResult ] = useState<any[]>([])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value === '') {
            setSearchResult([])
        }
        else {
            handleSearchBands(e.target.value.toLowerCase())
        }
        setBandInput(e.target.value)
    }

    useEffect(() => {
        const handleDatabaseRequest = async () => {
            const res = await fetch('http://localhost:3000/bands')
            const bands = await res.json()
            setDatabaseBands(bands)
        }
        handleDatabaseRequest()
    }, [])

    const handleSearchBands = async (request: string) => {
        const searchResult = databaseBands.map(({name, bandtype, country, genre, id, implemented}) => {
            bandtype = bandtype ? bandtype = bandTypeToEmoji(bandtype.toLowerCase()) : null;
            if(
                name?.toLowerCase().includes(request) ||
                bandtype?.includes(request) ||
                country?.toLowerCase()?.includes(request) ||
                genre?.toLowerCase()?.includes(request)
            ) {
                return { name, country, genre, id, implemented, bandtype }
            }
            else {
                return {}
            }
            
        })
        const filteredResult = searchResult.filter(band => band.name != null)
        setSearchResult(filteredResult)   
    }

    return (
        <main>
            <h1 className='centered'>Search music groups by their names or specifications. Some emojis included!</h1>
            <hr />
            <section>
            <input type='text' onChange={handleInput} value={bandInput} placeholder='Name or specifications'></input>
            <div className='resultField'>
                <ul>
                    {searchResult.map(({id, implemented, name, bandtype, country, genre}: band<string>) => (
                        <li key={id}>{`
                            ${implemented ? '⦿' : '〇'} 
                            ${name ? name : ' '} 
                            ${bandtype ? bandtype : ' '}  
                            ${country ? country : ' '}  
                            ${genre ? genre : ''} 
                        `}</li>)
                    )}
                </ul>
            </div>
            </section>
        </main>
    )
}

export default BandsList;