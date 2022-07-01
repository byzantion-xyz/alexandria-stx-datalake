import { TransactionList } from '@stacks/stacks-blockchain-api-types';

export const tx_list: TransactionList = {
  '0x63d19d332755a87bfb7003a2ca034362873a360f6cf2b01de27d030ff6b1d71f': {
    found: true,
    result: {
      tx_id: '0x63d19d332755a87bfb7003a2ca034362873a360f6cf2b01de27d030ff6b1d71f',
      nonce: 329,
      fee_rate: '359',
      sender_address: 'SP3R71MY36E12AT087F39BWFWSK5CGJ620Q5XMG2K',
      sponsored: false,
      post_condition_mode: 'deny',
      post_conditions: [
        {
          type: 'fungible',
          condition_code: 'sent_equal_to',
          amount: '217496348706',
          principal: {
            type_id: 'principal_standard',
            address: 'SP3R71MY36E12AT087F39BWFWSK5CGJ620Q5XMG2K'
          },
          asset: {
            contract_name: 'fwp-wstx-alex-50-50-v1-01',
            asset_name: 'fwp-wstx-alex-50-50-v1-01',
            contract_address: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9'
          }
        }
      ],
      anchor_mode: 'any',
      is_unanchored: false,
      block_hash: '0x99e351ad782fae3ecd2a8dfbd916bfe87086a5f1a0014bdc0a5f091ee6e11a1f',
      parent_block_hash: '0xa112e1fe4618b7fc830773cd2f858069cea16ba53cee3bdce359cb8f59a1f270',
      block_height: 65999,
      burn_block_time: 1656627477,
      burn_block_time_iso: '2022-06-30T22:17:57.000Z',
      parent_burn_block_time: 1656627214,
      parent_burn_block_time_iso: '2022-06-30T22:13:34.000Z',
      canonical: true,
      tx_index: 167,
      tx_status: 'success',
      tx_result: {
        hex: '0x0703',
        repr: '(ok true)'
      },
      microblock_hash: '',
      microblock_sequence: 2147483647,
      microblock_canonical: true,
      event_count: 1,
      events: [
        {
          event_index: 0,
          event_type: 'fungible_token_asset',
          tx_id: '0x63d19d332755a87bfb7003a2ca034362873a360f6cf2b01de27d030ff6b1d71f',
          asset: {
            asset_event_type: 'transfer',
            asset_id:
              'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-alex-50-50-v1-01::fwp-wstx-alex-50-50-v1-01',
            sender: 'SP3R71MY36E12AT087F39BWFWSK5CGJ620Q5XMG2K',
            recipient: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
            amount: '217496348706'
          }
        }
      ],
      execution_cost_read_count: 179,
      execution_cost_read_length: 43132,
      execution_cost_runtime: 1958236,
      execution_cost_write_count: 67,
      execution_cost_write_length: 9252,
      tx_type: 'contract_call',
      contract_call: {
        contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-reserve-pool',
        function_name: 'stake-tokens',
        function_signature:
          '(define-public (stake-tokens (token-trait trait_reference) (amount-token uint) (lock-period uint)))',
        function_args: [
          {
            hex: '0x0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d196677702d777374782d616c65782d35302d35302d76312d3031',
            repr: "'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-alex-50-50-v1-01",
            name: 'token-trait',
            type: 'trait_reference'
          },
          {
            hex: '0x01000000000000000000000032a3cae822',
            repr: 'u217496348706',
            name: 'amount-token',
            type: 'uint'
          },
          {
            hex: '0x0100000000000000000000000000000020',
            repr: 'u32',
            name: 'lock-period',
            type: 'uint'
          }
        ]
      }
    }
  },
  '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30': {
    found: true,
    result: {
      tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
      nonce: 961,
      fee_rate: '413',
      sender_address: 'SP1M2QYNSFQDHN8QJGW96Q5EY10H5X4RSM5PZRY0S',
      sponsored: false,
      post_condition_mode: 'allow',
      post_conditions: [],
      anchor_mode: 'any',
      is_unanchored: false,
      block_hash: '0x99e351ad782fae3ecd2a8dfbd916bfe87086a5f1a0014bdc0a5f091ee6e11a1f',
      parent_block_hash: '0xa112e1fe4618b7fc830773cd2f858069cea16ba53cee3bdce359cb8f59a1f270',
      block_height: 65999,
      burn_block_time: 1656627477,
      burn_block_time_iso: '2022-06-30T22:17:57.000Z',
      parent_burn_block_time: 1656627214,
      parent_burn_block_time_iso: '2022-06-30T22:13:34.000Z',
      canonical: true,
      tx_index: 169,
      tx_status: 'success',
      tx_result: {
        hex: '0x070b0000000501000000000000000000000000000000000100000000000000000000000014238c8401000000000000000000000000000003e8010000000000000000000000001460f446010000000000000000000000001460f446',
        repr: '(ok (list u0 u337874052 u1000 u341898310 u341898310))'
      },
      microblock_hash: '',
      microblock_sequence: 2147483647,
      microblock_canonical: true,
      event_count: 13,
      events: [
        {
          event_index: 0,
          event_type: 'stx_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            sender: 'SP1M2QYNSFQDHN8QJGW96Q5EY10H5X4RSM5PZRY0S',
            recipient: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            amount: '337874052'
          }
        },
        {
          event_index: 1,
          event_type: 'stx_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            sender: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            recipient: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
            amount: '337874052'
          }
        },
        {
          event_index: 2,
          event_type: 'fungible_token_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            asset_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
            sender: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
            recipient: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            amount: '142802735085'
          }
        },
        {
          event_index: 3,
          event_type: 'smart_contract_log',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          contract_log: {
            contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fixed-weight-pool-v1-01',
            topic: 'print',
            value: {
              hex: '0x0c0000000306616374696f6e0d0000000c737761702d782d666f722d7904646174610c0000000b0962616c616e63652d7801000000000000000000018f2a83ba65590962616c616e63652d7901000000000000000000069d6b7d3fc35d0a6665652d726174652d7801000000000000000000000000000493e00a6665652d726174652d7901000000000000000000000000000493e00a6665652d7265626174650100000000000000000000000002faf0800e6665652d746f2d616464726573730616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d226d756c74697369672d6677702d777374782d616c65782d35302d35302d76312d30310e6f7261636c652d617665726167650100000000000000000000000005a995c00e6f7261636c652d656e61626c656403106f7261636c652d726573696c69656e7401000000000000000000000000192f65260a706f6f6c2d746f6b656e0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d196677702d777374782d616c65782d35302d35302d76312d30310c746f74616c2d737570706c79010000000000000000000330ab868043d1066f626a6563740d00000004706f6f6c',
              repr: '(tuple (action "swap-x-for-y") (data (tuple (balance-x u438887738139993) (balance-y u1861934848656221) (fee-rate-x u300000) (fee-rate-y u300000) (fee-rebate u50000000) (fee-to-address \'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.multisig-fwp-wstx-alex-50-50-v1-01) (oracle-average u95000000) (oracle-enabled true) (oracle-resilient u422536486) (pool-token \'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-alex-50-50-v1-01) (total-supply u897938184225745))) (object "pool"))'
            }
          }
        },
        {
          event_index: 4,
          event_type: 'fungible_token_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            asset_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
            sender: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            recipient: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
            amount: '142802735085'
          }
        },
        {
          event_index: 5,
          event_type: 'fungible_token_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            asset_id: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda',
            sender: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault',
            recipient: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            amount: '157301292'
          }
        },
        {
          event_index: 6,
          event_type: 'smart_contract_log',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          contract_log: {
            contract_id: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token',
            topic: 'print',
            value: {
              hex: '0x09',
              repr: 'none'
            }
          }
        },
        {
          event_index: 7,
          event_type: 'smart_contract_log',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          contract_log: {
            contract_id: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.simple-weight-pool-alex',
            topic: 'print',
            value: {
              hex: '0x0c0000000306616374696f6e0d0000000c737761702d782d666f722d7904646174610c0000000d0962616c616e63652d7801000000000000000000005c40b7bb3a110962616c616e63652d7901000000000000000000000a2d9bd9c75209656e642d626c6f636b01ffffffffffffffffffffffffffffffff0a6665652d726174652d7801000000000000000000000000000493e00a6665652d726174652d7901000000000000000000000000000493e00a6665652d7265626174650100000000000000000000000002faf0800e6665652d746f2d616464726573730616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d166d756c74697369672d6677702d616c65782d757364610e6f7261636c652d617665726167650100000000000000000000000005a995c00e6f7261636c652d656e61626c656403106f7261636c652d726573696c69656e740100000000000000000000000000aa6ffc0a706f6f6c2d746f6b656e0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d0d6677702d616c65782d757364610b73746172742d626c6f636b010000000000000000000000000000d8e60c746f74616c2d737570706c7901000000000000000000001e4efaba653b066f626a6563740d00000004706f6f6c',
              repr: '(tuple (action "swap-x-for-y") (data (tuple (balance-x u101433030162961) (balance-y u11191004546898) (end-block u340282366920938463463374607431768211455) (fee-rate-x u300000) (fee-rate-y u300000) (fee-rebate u50000000) (fee-to-address \'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.multisig-fwp-alex-usda) (oracle-average u95000000) (oracle-enabled true) (oracle-resilient u11169788) (pool-token \'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-alex-usda) (start-block u55526) (total-supply u33324562801979))) (object "pool"))'
            }
          }
        },
        {
          event_index: 8,
          event_type: 'smart_contract_log',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          contract_log: {
            contract_id: 'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.stackswap-swap-v5k',
            topic: 'print',
            value: {
              hex: '0x0c0000000306616374696f6e0d0000000c737761702d792d666f722d7804646174610c000000080962616c616e63652d7801000000000000000000000046e56570170962616c616e63652d79010000000000000000000000208e8869e10d6665652d62616c616e63652d78010000000000000000000000002d1173cd0d6665652d62616c616e63652d79010000000000000000000000004116e08a0e6665652d746f2d616464726573730516ef9e76f79157366febf05711aed0df494fdb139c0f6c69717569646974792d746f6b656e06167e9152cdbbb9fef066df4e1b88b19bcb313acc901b6c69717569646974792d746f6b656e2d76356b30796c356f74386c046e616d650d000000085354582d555344410c7368617265732d746f74616c0100000000000000000000002f5e2467ce066f626a6563740d0000000470616972',
              repr: '(tuple (action "swap-y-for-x") (data (tuple (balance-x u304496341015) (balance-y u139830258145) (fee-balance-x u756118477) (fee-balance-y u1092018314) (fee-to-address \'SP3QSWXQQJ5BKCVZBY1BH3BPGVX4MZPRKKG8CBDGR) (liquidity-token \'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.liquidity-token-v5k0yl5ot8l) (name "STX-USDA") (shares-total u203442907086))) (object "pair"))'
            }
          }
        },
        {
          event_index: 9,
          event_type: 'stx_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            sender: 'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.liquidity-token-v5k0yl5ot8l',
            recipient: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            amount: '341898310'
          }
        },
        {
          event_index: 10,
          event_type: 'fungible_token_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            asset_id: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda',
            sender: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            recipient: 'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.liquidity-token-v5k0yl5ot8l',
            amount: '157301292'
          }
        },
        {
          event_index: 11,
          event_type: 'smart_contract_log',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          contract_log: {
            contract_id: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token',
            topic: 'print',
            value: {
              hex: '0x09',
              repr: 'none'
            }
          }
        },
        {
          event_index: 12,
          event_type: 'stx_asset',
          tx_id: '0xc99cd0766925e51b6a8f9cc6a15543ba2a9547bed73af4174fce8bf163ad7f30',
          asset: {
            asset_event_type: 'transfer',
            sender: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
            recipient: 'SP1M2QYNSFQDHN8QJGW96Q5EY10H5X4RSM5PZRY0S',
            amount: '341898310'
          }
        }
      ],
      execution_cost_read_count: 209,
      execution_cost_read_length: 623250,
      execution_cost_runtime: 1962793,
      execution_cost_write_count: 23,
      execution_cost_write_length: 1317,
      tx_type: 'contract_call',
      contract_call: {
        contract_id: 'SP2M0GDCMTZN0WDB8R8SNTH3DVVTKP6NV1HYSKWZT.reasonable-sapphire-sturgeon',
        function_name: 'BCHWCciJAWsrAEtVQ',
        function_signature:
          '(define-public (BCHWCciJAWsrAEtVQ (biqdMkSckelmBXREy uint) (HFeFyXHEHTmrmmOcl bool) (ouLOLHHpBLBAKmsYT bool) (VPAxBGMKpQWTjRMnu trait_reference) (kwrDL3XesfmiRhRVA trait_reference) (neOCKrExDlzWtNOHT trait_reference) (KoQBDapJJAmQyRaTbT trait_reference) (yUCHeGXpSYLsVQrQOv trait_reference) (AgIJzBsylJwSnXjfW uint) (qRXbRiatsWCtdRTfy bool) (jwragaWAMRRZvKUrN bool)))',
        function_args: [
          {
            hex: '0x01000000000000000000000000000003e8',
            repr: 'u1000',
            name: 'biqdMkSckelmBXREy',
            type: 'uint'
          },
          {
            hex: '0x03',
            repr: 'true',
            name: 'HFeFyXHEHTmrmmOcl',
            type: 'bool'
          },
          {
            hex: '0x04',
            repr: 'false',
            name: 'ouLOLHHpBLBAKmsYT',
            type: 'bool'
          },
          {
            hex: '0x0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d0a746f6b656e2d77737478',
            repr: "'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx",
            name: 'VPAxBGMKpQWTjRMnu',
            type: 'trait_reference'
          },
          {
            hex: '0x0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d0b746f6b656e2d7775736461',
            repr: "'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wusda",
            name: 'kwrDL3XesfmiRhRVA',
            type: 'trait_reference'
          },
          {
            hex: '0x06167e9152cdbbb9fef066df4e1b88b19bcb313acc900e777374782d746f6b656e2d763461',
            repr: "'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.wstx-token-v4a",
            name: 'neOCKrExDlzWtNOHT',
            type: 'trait_reference'
          },
          {
            hex: '0x0616982f3ec112a5f5928a5c96a914bd733793b896a50a757364612d746f6b656e',
            repr: "'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token",
            name: 'KoQBDapJJAmQyRaTbT',
            type: 'trait_reference'
          },
          {
            hex: '0x06167e9152cdbbb9fef066df4e1b88b19bcb313acc901b6c69717569646974792d746f6b656e2d76356b30796c356f74386c',
            repr: "'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.liquidity-token-v5k0yl5ot8l",
            name: 'yUCHeGXpSYLsVQrQOv',
            type: 'trait_reference'
          },
          {
            hex: '0x0100000000000000000000000014238c84',
            repr: 'u337874052',
            name: 'AgIJzBsylJwSnXjfW',
            type: 'uint'
          },
          {
            hex: '0x03',
            repr: 'true',
            name: 'qRXbRiatsWCtdRTfy',
            type: 'bool'
          },
          {
            hex: '0x04',
            repr: 'false',
            name: 'jwragaWAMRRZvKUrN',
            type: 'bool'
          }
        ]
      }
    }
  }
};
