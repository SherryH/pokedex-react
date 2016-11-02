import React from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { createFragment } from 'apollo-client'

import PokemonCard from './PokemonCard'
import PokemonCardHeader from './PokemonCardHeader'

class PokemonPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div>
        <PokemonCardHeader trainer={this.props.data.Pokemon.trainer} />
        <PokemonCard pokemon={this.props.data.Pokemon} handleCancel={this.goBack}/>
      </div>
    )
  }

  goBack = () => {
    this.props.router.replace('/')
  }
}

const trainerInfoFragment = createFragment(gql`
  fragment trainerInfo on Trainer {
    name
    ownedPokemons {
      id
    }
  }
`)

const pokemonInfoFragment = createFragment(gql`
  fragment pokemonInfo on Pokemon {
    id
    imageUrl
    name
  }
`)

const PokemonQuery = gql`query($id: ID!) {
    Pokemon(id: $id) {
      ... pokemonInfo
      trainer {
        ... trainerInfo
      }
    }
  }
`

const PokemonPageWithData = graphql(PokemonQuery, {
  options: (ownProps) => ({
      variables: {
        id: ownProps.params.pokemonId
      },
      fragments: [pokemonInfoFragment, trainerInfoFragment]
    })
  }
)(withRouter(PokemonPage))

export default PokemonPageWithData
