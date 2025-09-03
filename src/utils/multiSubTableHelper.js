/**
 * 多子表配置帮助函数
 * 用于处理代码生成器中多子表配置的序列化和反序列化
 */

/**
 * 将多子表配置序列化为字符串
 * @param {Array} subTableConfigs 子表配置数组
 * @returns {string} 序列化后的字符串
 */
export function serializeSubTableConfigs(subTableConfigs) {
  if (!subTableConfigs || subTableConfigs.length === 0) {
    return '';
  }
  try {
    // 过滤掉不必要的字段，只保留关键信息
    const filteredConfigs = subTableConfigs.map(config => ({
      tableName: config.tableName,
      fkName: config.fkName
    }));
    return JSON.stringify(filteredConfigs);
  } catch (e) {
    console.error('序列化子表配置失败:', e);
    return '';
  }
}

/**
 * 从字符串反序列化多子表配置
 * @param {string} serializedConfigs 序列化的配置字符串
 * @returns {Array} 子表配置数组
 */
export function deserializeSubTableConfigs(serializedConfigs) {
  if (!serializedConfigs) {
    return [];
  }
  try {
    const configs = JSON.parse(serializedConfigs);
    // 确保返回的是数组格式
    if (Array.isArray(configs)) {
      return configs;
    }
    return [];
  } catch (e) {
    console.error('反序列化子表配置失败:', e);
    return [];
  }
}

/**
 * 从表信息中提取多子表配置
 * @param {Object} tableInfo 表信息对象
 * @returns {Array} 子表配置数组
 */
export function extractSubTableConfigsFromTableInfo(tableInfo) {
  if (!tableInfo || !tableInfo.options) {
    return [];
  }
  
  try {
    const options = typeof tableInfo.options === 'string' 
      ? JSON.parse(tableInfo.options) 
      : tableInfo.options;
      
    if (options && options.subTableConfigs) {
      return options.subTableConfigs;
    }
    
    // 如果没有找到多子表配置，但存在单子表配置，则转换为多子表格式
    if (tableInfo.subTableName && tableInfo.subTableFkName) {
      return [{
        tableName: tableInfo.subTableName,
        fkName: tableInfo.subTableFkName
      }];
    }
    
    return [];
  } catch (e) {
    console.error('从表信息中提取子表配置失败:', e);
    return [];
  }
}

/**
 * 将多子表配置合并到表信息中
 * @param {Object} tableInfo 表信息对象
 * @param {Array} subTableConfigs 子表配置数组
 * @returns {Object} 更新后的表信息对象
 */
export function mergeSubTableConfigsToTableInfo(tableInfo, subTableConfigs) {
  if (!tableInfo) {
    return tableInfo;
  }
  
  // 创建表信息副本
  const updatedTableInfo = { ...tableInfo };
  
  // 更新options字段
  try {
    const options = typeof updatedTableInfo.options === 'string' 
      ? JSON.parse(updatedTableInfo.options) 
      : (updatedTableInfo.options || {});
      
    // 保存多子表配置
    options.subTableConfigs = subTableConfigs;
    
    // 兼容原有单子表配置（使用第一个子表）
    if (subTableConfigs && subTableConfigs.length > 0) {
      updatedTableInfo.subTableName = subTableConfigs[0].tableName;
      updatedTableInfo.subTableFkName = subTableConfigs[0].fkName;
    } else {
      updatedTableInfo.subTableName = '';
      updatedTableInfo.subTableFkName = '';
    }
    
    updatedTableInfo.options = JSON.stringify(options);
  } catch (e) {
    console.error('合并子表配置到表信息失败:', e);
  }
  
  return updatedTableInfo;
}

export default {
  serializeSubTableConfigs,
  deserializeSubTableConfigs,
  extractSubTableConfigsFromTableInfo,
  mergeSubTableConfigsToTableInfo
};