package io.enkrypt.kafka.streams.processors

import io.enkrypt.avro.exchange.ExchangeRateRecord
import io.enkrypt.avro.exchange.SymbolKeyRecord
import io.enkrypt.avro.processing.ContractMetadataRecord
import io.enkrypt.common.extensions.isValid
import io.enkrypt.kafka.streams.config.Topics
import io.enkrypt.kafka.streams.serdes.Serdes
import mu.KLogger
import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.streams.Topology
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Materialized
import org.apache.kafka.streams.kstream.Produced
import java.util.Properties

class ExchangeRatesProcessor : AbstractKafkaProcessor() {

  override val id: String = "exchange-rates-processor"

  override val kafkaProps: Properties = Properties()
    .apply {
      putAll(baseKafkaProps.toMap())
      put(StreamsConfig.APPLICATION_ID_CONFIG, id)
      put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 1)
    }

  override val logger: KLogger = KotlinLogging.logger {}

  override fun buildTopology(): Topology {

    // Create stream builder
    val builder = StreamsBuilder()

    // Listen to raw contract-metadata and convert the key to use symbol
    val ethTokensStream = builder
      .table<SymbolKeyRecord, ContractMetadataRecord>(
        Topics.EthTokensListBySymbol,
        Consumed.with(Serdes.SymbolKey(), Serdes.ContractMetadata())
      )

    // Listen to raw exchange rates topic and match those with symbol and write to tokens-exchange-rate
    builder
      .table<SymbolKeyRecord, ExchangeRateRecord>(
        Topics.RawExchangeRates,
        Consumed.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .filter { _, v -> v.isValid() }
      .join(
        ethTokensStream,
        { rate, token -> rate.apply { if (token.getAddress() != null) setAddress(token.getAddress()) } },
        Materialized.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )
      .toStream()
      .filter { _, v -> v.getAddress() != null }
      .to(
        Topics.TokenExchangeRates,
        Produced.with(Serdes.SymbolKey(), Serdes.ExchangeRate())
      )

    // Generate the topology
    return builder.build()
  }
}
