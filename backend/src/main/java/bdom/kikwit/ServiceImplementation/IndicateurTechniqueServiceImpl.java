package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.IndicateurTechniqueRequestDto;
import bdom.kikwit.Dto.IndicateurTechniqueResponseDto;
import bdom.kikwit.Entities.CartographieStructure;
import bdom.kikwit.Entities.Etablissement;
import bdom.kikwit.Entities.IndicateurTechnique;
import bdom.kikwit.Mappers.IndicateurTechniqueMapper;
import bdom.kikwit.Repositories.EtablissementRepository;
import bdom.kikwit.Repositories.IndicateurTechniqueRepository;
import bdom.kikwit.Services.IndicateurTechniqueService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @Transactional @AllArgsConstructor
public class IndicateurTechniqueServiceImpl implements IndicateurTechniqueService {
    private IndicateurTechniqueMapper mapper;
    private IndicateurTechniqueRepository repository;
    private EtablissementRepository etablissementRepository;

    //Insertion d'un indicateur
    @Override
    public IndicateurTechniqueResponseDto save(IndicateurTechniqueRequestDto requestDto) {
        IndicateurTechnique indicateurTechnique = mapper.fromIndicateurTechniqueRequestDto(requestDto);
        IndicateurTechnique save = repository.save(indicateurTechnique);
        return mapper.toIndicateurTechniqueResponseDto(save);
    }
//Modification d'un indicateur
    @Override
    public IndicateurTechniqueResponseDto update(Long id, IndicateurTechniqueRequestDto requestDto) {
        IndicateurTechnique technique = repository.findById(id).get();
        IndicateurTechnique fromDto = mapper.fromIndicateurTechniqueRequestDto(requestDto);
        technique.setId_ess(fromDto.getId_ess());
        technique.setApa(fromDto.getApa());
        technique.setCpn1(fromDto.getCpn1());
        technique.setCpn1_16(fromDto.getCpn1_16());
        technique.setCpn4(fromDto.getCpn4());
        technique.setCesarienne(fromDto.getCesarienne());
        technique.setChirurgieMajeure(fromDto.getChirurgieMajeure());
        technique.setDc_ap48h(fromDto.getDc_ap48h());
        technique.setDc_av48h(fromDto.getDc_av48h());
        technique.setDc_maternel(fromDto.getDc_maternel());
        technique.setDc_neonat(fromDto.getDc_neonat());
        technique.setDiabeteNotification(fromDto.getDiabeteNotification());
        technique.setDiarheSimple(fromDto.getDiarheSimple());
        technique.setTransfusion(fromDto.getTransfusion());
        technique.setHospitalise(fromDto.getHospitalise());
        technique.setInfePostOp(fromDto.getInfePostOp());
        technique.setNv_acc_pf(fromDto.getNv_acc_pf());
        technique.setNv_casCuratif(fromDto.getNv_casCuratif());
        technique.setTransfusionTeste4Marquer(fromDto.getTransfusionTeste4Marquer());
        technique.setPeriode(fromDto.getPeriode());
        repository.save(technique);
        return mapper.toIndicateurTechniqueResponseDto(technique);
    }

    @Override
    public String delete(Long id) {
        Optional<IndicateurTechnique> indicateurTechnique = repository.findById(id);
        if (indicateurTechnique.isPresent()){
            repository.deleteById(id);
            return " Indicateur supprimée avec succes";
        }
        return "Aucun indicateur trouvée";
    }

    // Liste de tous les indicateurs
    @Override
    public List<IndicateurTechniqueResponseDto> getAll() {
        List<IndicateurTechnique> technique = repository.findAll();
        for(IndicateurTechnique it:technique){
            Etablissement etablissement = etablissementRepository.findById(it.getId_ess()).get();
            it.setEtablissement(etablissement);
        }
        return technique.stream()
                .map(indicateurTechnique -> mapper.toIndicateurTechniqueResponseDto(indicateurTechnique))
                .collect(Collectors.toList());
    }
}
